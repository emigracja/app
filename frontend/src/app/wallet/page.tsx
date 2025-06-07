"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import StockList from "@/components/stocks/StockList";
import NewsList from "@/components/news/NewsList";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { BeatLoader } from "react-spinners";
import NewsFilters from "@/components/news/NewsFilters";
import filter from "../../../public/icons/filter.svg";
import Loader from "@/components/loader/Loader";
import axiosInstance from "@/utils/axios";
import { News } from "@/types/news";
import useStore from "@/store/useStore";

interface FetchResponse {
  data: News[];
  nextPage: number | null | undefined; // The page number for the *next* fetch, or null/undefined if no more pages
}

const fetchStocks = async () => {
  try {
    const response = await axiosInstance.get(`/user/stocks`);
    return response.data;
  } catch (err) {
    throw new Error(`Error fetching stocks: ${err}`);
  }
};

const Wallet = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainer = useRef<HTMLDivElement | null>(null);
  const [searchParams, setSearchParams] = useState<{ [key: string]: string }>(
    {}
  );

  const { ref, inView } = useInView({});
  const filtersContainer = useRef<HTMLDivElement | null>(null);
  const filtersOpen = useStore((state) => state.filtersOpen);
  const setFiltersOpen = useStore((state) => state.setFiltersOpen);

  const fetchNews = async ({ pageParam = 0 }): Promise<FetchResponse> => {
    const filteredSearchParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== "")
    );
    const params = new URLSearchParams({
      page: String(pageParam),
      ...filteredSearchParams,
    });
    console.log(params.toString());
    try {
      const response = await axiosInstance.get(
        `/user/articles?${params.toString()}`
      );

      const articles = response.data || [];
      const hasMore = articles.length > 0;
      console.log(articles);
      return {
        data: articles,
        nextPage: hasMore ? pageParam + 1 : undefined,
      };
    } catch (err) {
      console.error("Error fetching news:", err);
      throw err;
    }
  };

  const newsQuery = useInfiniteQuery<FetchResponse, Error>({
    queryKey: ["usernews", searchParams],
    queryFn: fetchNews,
    getNextPageParam: (lastPage: any) => {
      // lastPage is the result returned by fetchNews for the last page fetched
      return lastPage.nextPage;
    },
  });
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status, // 'loading', 'error', 'success'
    refetch,
  } = newsQuery;

  const news = data;

  const stocksQuery = useQuery({
    queryKey: ["userstocks"],
    queryFn: fetchStocks,
  });
  const stocks = stocksQuery.data;

  // Effect to fetch next page when the ref element comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    let intervalId: number;
    let added = false;

    const handleScroll = () => {
      if (scrollContainer.current) {
        const scrollLeft = scrollContainer.current.scrollLeft;
        const maxScrollLeft =
          scrollContainer.current.scrollWidth -
          scrollContainer.current.clientWidth;
        setScrollPosition((scrollLeft / maxScrollLeft) * 100);
      }
    };

    const scrollContCurrent = scrollContainer.current;

    const tryAddListener = () => {
      const el = scrollContainer.current;
      if (el && !added) {
        el.addEventListener("scroll", handleScroll);
        added = true;
        clearInterval(intervalId);
      }
    };

    intervalId = window.setInterval(tryAddListener, 100); // check every 100ms

    return () => {
      if (scrollContCurrent) {
        scrollContCurrent.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

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

  const onSubmit = useCallback((params: { [key: string]: string }) => {
    setSearchParams(params);
    setFiltersOpen(false);
  }, []);

  const isLoading = newsQuery.isLoading || stocksQuery.isLoading;

  const handleDotClick = (position: number) => {
    if (scrollContainer.current) {
      const scrollLeft =
        (scrollContainer.current.scrollWidth -
          scrollContainer.current.clientWidth) *
        position;
      scrollContainer.current.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (status === "error") {
    return (
      <div className="my-5 text-center text-white opacity-70">
        Error loading news: {error?.message}
      </div>
    );
  }

  const allNews = news?.pages.flatMap((page: any) => page.data) ?? [];

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden">
      <section
        ref={scrollContainer}
        className="relative flex overflow-x-scroll scrollbar-hide pb-10 snap-x snap-mandatory"
      >
        <div className="flex w-[200vw] box-border justify-between px-1">
          <div className="flex flex-col overflow-y-scroll align-middle gap-2 w-[100vw] box-border snap-center">
            <h2 className="font-bold text-lg text-white/85 px-2">
              Your stocks ({stocks.length})
            </h2>
            <StockList partialStocks={stocks} />
          </div>
          <div className="w-[100vw] overflow-y-scroll box-border snap-center px-1">
            <div className="flex justify-between align-center">
              <h2 className="font-bold text-lg text-white/85 px-2">
                Affecting news
              </h2>
              <Link href={"?filter"}>
                <Image
                  className="box-border ml-2 rounded-xl active:bg-white/5 p-1"
                  src={filter}
                  alt="filter"
                  height={40}
                  width={40}
                  onClick={() => setFiltersOpen(!filtersOpen)}
                />
              </Link>
            </div>
            <div className="hidden" ref={filtersContainer}>
              <NewsFilters onSubmit={onSubmit} />
            </div>
            <NewsList news={allNews} />
            <div
              ref={ref}
              className="h-[50px] text-center text-white opacity-70"
            >
              {isFetchingNextPage ? (
                <span className="flex align-middle justify-center w-full mt-15">
                  <BeatLoader
                    className="flex align-middle justify-center"
                    color="white"
                  />
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      <div className="absolute flex w-full h-0 bottom-3 p-1 items-center justify-center">
        <div
          className={`dot p-1 ${scrollPosition < 50 ? "active" : ""}`}
          onClick={() => handleDotClick(0)}
        ></div>
        <div
          className={`dot p-1 ${scrollPosition >= 50 ? "active" : ""}`}
          onClick={() => handleDotClick(1)}
        ></div>
      </div>
    </div>
  );
};

export default Wallet;
