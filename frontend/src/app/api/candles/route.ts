import { NextResponse } from "next/server";
import fs from "fs/promises"; // Node.js File System module with promises
import path from "path"; // Node.js Path module

const CACHE_DIR = path.join(process.cwd(), ".cache", "stooq_data");

async function ensureCacheDirectoryExists() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create cache directory:", CACHE_DIR, error);
  }
}

interface StooqDataItem {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export async function GET(request: Request) {
  await ensureCacheDirectoryExists();

  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  // const interval = searchParams.get("interval") || "1h";
  const limitParam = searchParams.get("limit") || "100";
  const limit = parseInt(limitParam, 10);

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const filename = `${symbol
    .toLowerCase()
    .replace(/[^a-z0-9.-]/gi, "_")}_${today}.json`; // Sanitize symbol for filename
  const filePath = path.join(CACHE_DIR, filename);

  // 1. Try to read from cache
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const cachedDataArray: StooqDataItem[] = JSON.parse(fileContent); // Expecting an array of StooqDataItem

    if (cachedDataArray && cachedDataArray.length > 0) {
      console.log(`[CACHE HIT] Serving ${symbol} data from ${filename}`);
      const lastItem = cachedDataArray.at(-1);
      if (lastItem) {
        const price = lastItem.close;
        const todaysPriceChange = lastItem.close - lastItem.open;
        return NextResponse.json({
          price,
          todaysPriceChange,
          periodPrices: cachedDataArray.slice(-limit, cachedDataArray.length),
          source: "cache",
        });
      }
    }
    console.warn(
      `[CACHE WARN] Cached data for ${symbol} in ${filename} was empty or malformed. Refetching.`
    );
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.log(
        `[CACHE MISS] File ${filename} not found. Fetching from Stooq.`
      );
    } else {
      console.warn(
        `[CACHE ERROR] Error reading or parsing ${filename}: ${error.message}. Refetching.`
      );
    }
    // Fall through to fetch from Stooq if file not found or other error
  }

  // 2. If cache miss or error, fetch from Stooq
  try {
    console.log(`[STOOQ FETCH] Fetching ${symbol} data from Stooq.`);
    const res = await fetch(
      `https://stooq.pl/q/d/l/?s=${symbol.toLowerCase()}&i=d` // i=d is for daily data
    );

    if (!res.ok) {
      throw new Error(`Stooq API request failed with status ${res.status}`);
    }

    const csv = await res.text();
    const [header, ...rows] = csv.trim().split("\n");

    if (
      rows.length === 0 ||
      (rows.length === 1 && rows[0].startsWith("Brak danych"))
    ) {
      console.log(`No data found for symbol: ${symbol} on Stooq.`);
      return NextResponse.json(
        { error: `No data for symbol ${symbol}` },
        { status: 404 }
      );
    }

    const data: StooqDataItem[] = rows
      .map((row) => {
        const values = row.split(",");
        return {
          time: values[0],
          open: Number(values[1]),
          high: Number(values[2]),
          low: Number(values[3]),
          close: Number(values[4]),
        };
      })
      .filter((item) => item.time && !isNaN(item.open) && !isNaN(item.close));

    if (data.length === 0) {
      console.log(`No valid data rows after parsing for symbol: ${symbol}.`);
      return NextResponse.json(
        { error: `No valid data rows for ${symbol}` },
        { status: 404 }
      );
    }

    const lastItem = data.at(-1);
    if (lastItem) {
      // Save the full data array to cache before slicing for response
      try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
        console.log(`[CACHE WRITE] Saved ${symbol} data to ${filename}`);
      } catch (writeError) {
        console.error(
          `[CACHE ERROR] Failed to write cache file ${filename}:`,
          writeError
        );
      }

      const price = lastItem.close;
      const todaysPriceChange = lastItem.close - lastItem.open;
      return NextResponse.json({
        price,
        todaysPriceChange,
        periodPrices: data.slice(-limit, data.length),
        source: "stooq",
      });
    }
    return NextResponse.json(
      { error: "No data found after processing" },
      { status: 404 }
    );
  } catch (err: any) {
    console.error(
      `[STOOQ ERROR] Failed to fetch or process data for ${symbol} from Stooq:`,
      err.message
    );
    return NextResponse.json(
      { error: `Failed to fetch data from Stooq: ${err.message}` },
      { status: 500 }
    );
  }
}
