"use client";

import { Stock, CandlestickData } from "@/types/stocks";
import useDataStore from "@/store/useDataStore";
import StockList from "@/components/stocks/StockList";

export default function StockPage() {
  const stocks = useDataStore((state) => state.stocks);

  return <StockList stocks={stocks} />;
}
