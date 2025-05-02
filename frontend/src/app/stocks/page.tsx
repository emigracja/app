"use client";

import StockList from "@/components/stocks/StockList";
import { useEffect, useCallback, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import axios from "@/utils/axios";
import { Stock } from "@/types/stocks";
import { addCandlestickMockData } from "@/utils/mockData";

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
