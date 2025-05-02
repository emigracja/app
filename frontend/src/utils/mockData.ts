import { Stock } from "@/types/stocks";

export function addCandlestickMockData(
  partialStocks: Partial<Stock>[]
): Stock[] {
  const out: Stock[] = [];
  partialStocks.map((el) => {
    out.push({
      id: el.id!,
      name: el.name!,
      symbol: el.symbol!,
      ekd: el.ekd!,
      exchange: el.exchange!,
      currency: "PLN",
      price: 253.5,
      todaysPriceChange: -4.5,
      currentPeriod: "1d",
      tags: [el.ekd!],
      periodPrices: [
        {
          time: "2024-03-01",
          open: 195.5,
          high: 210.3,
          low: 190.2,
          close: 205.8,
        },
        {
          time: "2024-03-02",
          open: 206.1,
          high: 215.7,
          low: 203.4,
          close: 211.5,
        },
        {
          time: "2024-03-03",
          open: 212.0,
          high: 220.9,
          low: 208.7,
          close: 218.3,
        },
        {
          time: "2024-03-04",
          open: 218.5,
          high: 225.0,
          low: 215.1,
          close: 223.4,
        },
        {
          time: "2024-03-05",
          open: 224.0,
          high: 230.8,
          low: 219.6,
          close: 228.2,
        },
        {
          time: "2024-03-06",
          open: 229.1,
          high: 235.3,
          low: 225.4,
          close: 232.9,
        },
        {
          time: "2024-03-07",
          open: 233.5,
          high: 240.1,
          low: 230.7,
          close: 238.6,
        },
        {
          time: "2024-03-08",
          open: 239.0,
          high: 245.5,
          low: 235.2,
          close: 242.3,
        },
        {
          time: "2024-03-09",
          open: 243.0,
          high: 250.4,
          low: 240.1,
          close: 248.7,
        },
        {
          time: "2024-03-10",
          open: 249.2,
          high: 255.9,
          low: 245.6,
          close: 253.5,
        },
      ],
    });
  });
  return out;
}
