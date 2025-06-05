"use client";

import StockList from "@/components/stocks/StockList";
import { useEffect, useRef, useState, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import axios from "@/utils/axios";
import { Stock } from "@/types/stocks";
import { addCandlestickMockData } from "@/utils/mockData";
import useStore from "@/store/useStore";

interface FetchResponse {
  data: Partial<Stock>[];
  nextPage: number | null | undefined;
}

export default function StockPage() {
  // --------------- INFINITE SCROLL STUFF ----------------------
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingCurrentPage, setIsLoadingCurrentPage] = useState(true);
  const [searchParams, setSearchParams] = useState<{ [key: string]: string }>(
    {}
  );
  const [symbolQuery, setSymbolQuery] = useState("");

  const filtersOpen = useStore((state) => state.filtersOpen);
  const setFiltersOpen = useStore((state) => state.setFiltersOpen);

  const filtersContainer = useRef<HTMLDivElement | null>(null);

  const fetchStocks = async ({ pageParam = 0 }): Promise<FetchResponse> => {
    const filteredSearchParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== "")
    );
    const params = new URLSearchParams({
      page: String(pageParam),
      ...filteredSearchParams,
    });
    try {
      const response = await axios.get(`/stocks?${params.toString()}`);

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

  const handleLoadingChange = (index: number, loading: boolean) => {
    if (index == currentPage) {
      if (!loading) {
        setIsLoadingCurrentPage(false);
        setCurrentPage(index + 1);
      } else {
        setIsLoadingCurrentPage(true);
      }
    }
  };

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
    refetch,
  } = useInfiniteQuery<FetchResponse, Error>({
    queryKey: ["stocks", searchParams],
    queryFn: fetchStocks,
    getNextPageParam: (lastPage: any) => {
      // lastPage is the result returned by fetchNews for the last page fetched
      return lastPage.nextPage;
    },
  });

  // Effect to fetch next page when the ref element comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isLoadingCurrentPage) {
      const timeout = setTimeout(() => {
        fetchNextPage();
      }, 300); // małe opóźnienie
      // fetchNextPage();
      return () => clearTimeout(timeout);
    }
  }, [
    inView,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoadingCurrentPage,
  ]);

  const allStocks = data?.pages.flatMap(
    (page) => page.data
  ) as Partial<Stock>[];

  const lastPageStocks = data?.pages[data.pages.length - 1]?.data ?? [];

  // --------------- FILTERING STUFF --------------------
  // Effect to open or close filters
  useEffect(() => {
    if (filtersContainer.current) {
      if (filtersOpen) {
        filtersContainer.current.style.display = "block";
      } else {
        filtersContainer.current.style.display = "none";
      }
    }
  }, [filtersOpen]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    handleSubmit({
      symbol: symbolQuery,
    });
  };

  const handleSubmit = useCallback((params: { [key: string]: string }) => {
    setSearchParams(params);
    setFiltersOpen(false);
  }, []);

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
      <div className="hidden" ref={filtersContainer}>
        <form onSubmit={onSubmit} className="p-2 w-full text-white">
          <input
            onChange={(e) => setSymbolQuery(e.target.value.toUpperCase())}
            className="p-2 w-full text-white border-white border-1 rounded-xl outline-none"
            type="text"
            placeholder="Search by symbol..."
          />
          <button
            type="submit"
            className={`
                my-2 p-2 w-full rounded-xl font-semibold transition duration-150 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                focus:ring-offset-gray-800/70 bg-blue-600 hover:bg-blue-700`}
          >
            Search
          </button>
        </form>
      </div>
      <div>
        {/* <StockList partialStocks={allStocks} /> */}
        {data?.pages.map((page, index) => (
          <StockList
            key={index}
            partialStocks={page.data}
            onLoadingChange={(loading) => handleLoadingChange(index, loading)}
          />
        ))}

        {/* --- Loading/Trigger Area --- */}
        <div
          ref={ref}
          className="h-[200px] my-5 text-center text-white opacity-70"
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
