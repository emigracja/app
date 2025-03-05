type Period = "1h" | "1d" | "1w" | "1m" | "1y" | "5y";
type Currency = "EUR" | "PLN" | "USD";

export interface CandlestickData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface Stock {
    id: string;
    title: string;
    shortcut: string;
    currency: Currency;
    market: string;
    price: number;
    todaysPriceChange: number;
    currentPeriod: Period;
    tags: string[];
    periodPrices: CandlestickData[];
}