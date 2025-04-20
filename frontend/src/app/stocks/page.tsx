"use client";

import useDataStore from "@/store/useDataStore";
import StockList from "@/components/stocks/StockList";
import { useEffect, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { debounce } from "lodash";

export default function StockPage() {
  const stocks = useDataStore((state) => state.stocks);

  const [filteredStocks, setFilteredStocks] = useState(stocks);

  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get("search");

    if (!searchQuery) {
      setFilteredStocks(stocks);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    searchQuery
      ? setFilteredStocks(
          stocks.filter((stock) =>
            stock.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      : setFilteredStocks(stocks);
  }, [searchParams, stocks]);

  const search = useCallback((query: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("search", query);
    window.history.pushState({}, "", url);
  }, []);

  const debouncedSearch = debounce((query: string) => {
    search(query);
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch.cancel();
    debouncedSearch(e.target.value);
  };

  return (
    <>
      <div className="w-full p-2">
        <input
          onChange={handleChange}
          className="p-2 w-full text-white border-white border-1 rounded-xl outline-none"
          type="text"
          placeholder="Search..."
        />
      </div>

      <StockList stocks={filteredStocks} />
    </>
  );
}
