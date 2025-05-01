export type Period = "1h" | "1d" | "1w" | "1m" | "1y" | "5y";
export type Currency = "EUR" | "PLN" | "USD";

export interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Stock {
  id: string;
  name: string;
  symbol: string;
  currency: Currency;
  exchange: string;
  ekd: string;
  price: number;
  todaysPriceChange: number;
  currentPeriod: Period;
  tags: string[];
  periodPrices: CandlestickData[];
}
