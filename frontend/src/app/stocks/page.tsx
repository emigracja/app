"use client";

import StockList from "@/components/stocks/StockList";
import { useEffect, useCallback, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import axios from "@/utils/axios";
import { Stock } from "@/types/stocks";

interface FetchResponse {
  data: Partial<Stock>[];
  nextPage: number | null | undefined;
}

const fetchStocks = async ({ pageParam = 0 }): Promise<FetchResponse> => {
  try {
    const response = await axios.get(`/stocks?page=${pageParam}`);

    const stocks = response.data || [];
    const hasMore = stocks.length > 0;

    return {
      data: stocks,
      nextPage: hasMore ? pageParam + 1 : undefined,
    };
  } catch (err) {
    console.error("Error fetching stocks:", err);
    throw err;
  }
};

function addCandlestickMockData(partialStocks: Partial<Stock>[]): Stock[] {
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

export default function StockPage() {
  // --------------- INFINITE SCROLL STUFF ----------------------

  const { ref, inView } = useInView({
    // threshold: 0, // Trigger when the element enters the viewport
    // triggerOnce: false // Keep observing even after it becomes visible once
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    status, // 'loading', 'error', 'success'
  } = useInfiniteQuery<FetchResponse, Error>({
    queryKey: ["stocks"],
    queryFn: fetchStocks,
    getNextPageParam: (lastPage, allPages) => {
      // lastPage is the result returned by fetchNews for the last page fetched
      return lastPage.nextPage;
    },
  });

  // Effect to fetch next page when the ref element comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allStocks = addCandlestickMockData(
    data?.pages.flatMap((page) => page.data) ?? []
  );

  // --------------- FILTERING STUFF --------------------
  // const [filteredStocks, setFilteredStocks] = useState(allStocks);

  // const searchParams = useSearchParams();

  // useEffect(() => {
  //   const searchQuery = searchParams.get("search");

  //   if (!searchQuery) {
  //     setFilteredStocks(allStocks);
  //   }

  //   // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  //   searchQuery
  //     ? setFilteredStocks(
  //         allStocks.filter((stock) =>
  //           stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  //         )
  //       )
  //     : setFilteredStocks(allStocks);
  // }, [searchParams, allStocks]);

  // const search = useCallback((query: string) => {
  //   const url = new URL(window.location.href);
  //   url.searchParams.set("search", query);
  //   window.history.pushState({}, "", url);
  // }, []);

  // const debouncedSearch = debounce((query: string) => {
  //   search(query);
  // }, 500);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   debouncedSearch.cancel();
  //   debouncedSearch(e.target.value);
  // };

  if (isLoading) {
    return (
      <div className="my-5 text-center text-white opacity-70">Loading...</div>
    );
  }

  if (status === "error") {
    return (
      <div className="my-5 text-center text-white opacity-70">
        Error loading stocks: {error?.message}
      </div>
    );
  }

  return (
    <>
      {/* <div className="w-full p-2">
        <input
          onChange={handleChange}
          className="p-2 w-full text-white border-white border-1 rounded-xl outline-none"
          type="text"
          placeholder="Search..."
        />
      </div> */}
      <div>
        <StockList stocks={allStocks} />

        {/* --- Loading/Trigger Area --- */}
        <div
          ref={ref}
          className="h-[50px] my-5 text-center text-white opacity-70"
        >
          {isFetchingNextPage ? (
            <span>Loading more stocks...</span>
          ) : hasNextPage ? (
            <span>Scroll down to load more...</span>
          ) : (
            <span>No more stocks to load.</span>
          )}
        </div>
      </div>
    </>
  );
}
