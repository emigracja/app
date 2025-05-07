"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import NewsList from "@/components/news/NewsList";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { News } from "@/types/news";
import axios from "@/utils/axios";
import { BeatLoader, MoonLoader } from "react-spinners";
import NewsFilters from "@/components/news/NewsFilters";
import Loader from "@/components/loader/Loader";
import useStore from "@/store/useStore";

interface FetchResponse {
  data: News[];
  nextPage: number | null | undefined; // The page number for the *next* fetch, or null/undefined if no more pages
}

export default function NewsPage() {
  const [searchParams, setSearchParams] = useState<{ [key: string]: string }>(
    {}
  );

  const { ref, inView } = useInView({
    // threshold: 0, // Trigger when the element enters the viewport
    // triggerOnce: false // Keep observing even after it becomes visible once
  });
  const filtersContainer = useRef<HTMLDivElement | null>(null);
  const filtersOpen = useStore((state) => state.filtersOpen);
  const setFiltersOpen = useStore((state) => state.setFiltersOpen);

  const fetchNews = async ({ pageParam = 0 }): Promise<FetchResponse> => {
    const params = new URLSearchParams({
      page: String(pageParam),
      ...searchParams,
    });
    try {
      const response = await axios.get(`/articles?${params.toString()}`);

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
    queryKey: ["news", searchParams],
    queryFn: fetchNews,
    getNextPageParam: (lastPage: any) => {
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

  const allNews = data?.pages.flatMap((page: any) => page.data) ?? [];

  return (
    <div>
      <div className="hidden" ref={filtersContainer}>
        <NewsFilters onSubmit={onSubmit} />
      </div>
      <NewsList news={allNews} />
      <div ref={ref} className="h-[50px] text-center text-white opacity-70">
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
  );
}
