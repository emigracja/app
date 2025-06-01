import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const interval = searchParams.get("interval") || "1h";
  const limit = searchParams.get("limit") || "100";

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://stooq.pl/q/d/l/?s=${symbol.toLowerCase()}&i=d`
    );
    const csv = await res.text();
    const [, ...rows] = csv.trim().split("\n");
    const data = rows.map((row) => {
      const values = row.split(",");
      return {
        time: values[0],
        open: Number(values[1]),
        high: Number(values[2]),
        low: Number(values[3]),
        close: Number(values[4]),
      };
    });
    const lastItem = data.at(-1);
    if (lastItem) {
      const price = lastItem.close;
      const todaysPriceChange = lastItem.close - lastItem.open;
      return NextResponse.json({
        price,
        todaysPriceChange,
        periodPrices: data.slice(-limit, data.length),
      });
    }
    return NextResponse.json({ status: 404 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch data from stooq" },
      { status: 500 }
    );
  }
}
