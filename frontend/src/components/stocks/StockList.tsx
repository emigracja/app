"use client";

import { ReactElement, useEffect } from "react";
import { Stock } from "@/types/stocks";
import StockCard from "./StockCard";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader/Loader";
import useUserStockStore from "@/store/useUserStockStore";

interface Props {
  partialStocks: Partial<Stock>[];
  onLoadingChange?: (loading: boolean) => void;
  label?: string;
}

const fetchCandles = async (stocks: Partial<Stock>[]): Promise<Stock[]> => {
  try {
    const fullStocks = await Promise.all(
      stocks.map(async (stock) => {
        const symbol = stock.symbol!;
        const candleRes = await fetch(
          `/api/candles?symbol=${symbol}&interval=1h&limit=100`
        );
        if (!candleRes.ok) return;
        return {
          ...stock,
          ...(await candleRes.json()),
          currency: "PLN",
          tags: [stock.ekd],
        };
      })
    );

    return fullStocks.filter((stock) => stock !== undefined) as Stock[];
  } catch (err) {
    console.error(`Error fetching stocks:`, err);
    throw err;
  }
};

const StockList = ({
  partialStocks,
  onLoadingChange,
  label,
}: Props): ReactElement => {
  const candleQuery = useQuery({
    // queryKey: partialStocks.map((s) => `stock-${s.id}`),
    queryKey: [`candles`, partialStocks.map((s) => s.id).join(",")],
    queryFn: () => fetchCandles(partialStocks),
  });

  const { updateUserStocks, userStocks } = useUserStockStore();

  useEffect(() => {
    updateUserStocks();
    console.log(userStocks);
  }, []);

  useEffect(() => {
    onLoadingChange?.(candleQuery.isLoading);
  }, [candleQuery.isLoading]);

  const stocks = candleQuery.data as Stock[];

  const userSymbols = userStocks.map((s) => s.symbol);

  // todo: loader
  if (candleQuery.isLoading || !stocks) {
    return <Loader />;
  }
  // todo: error

  const showLabel = !!(label && stocks.length);

  return (
    <>
      {showLabel && <p className="text-white px-2 pt-2 font-bold">{label}</p>}
      <div
        className="flex flex-col gap-6 p-2 h-full"
        style={{
          backgroundColor: "transparent",
        }}
      >
        {stocks.map((stock) => (
          <StockCard
            key={stock.id}
            {...stock}
            favorite={userSymbols.includes(stock.symbol)}
          />
        ))}
      </div>
    </>
  );
};

export default StockList;
