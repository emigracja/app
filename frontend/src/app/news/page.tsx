"use client";

import React, { useEffect } from "react";
import NewsList from "@/components/news/NewsList";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { News } from "@/types/news";

import axios from "@/utils/axios";

interface FetchResponse {
  data: News[];
  nextPage: number | null | undefined; // The page number for the *next* fetch, or null/undefined if no more pages
}

const fetchNews = async ({ pageParam = 0 }): Promise<FetchResponse> => {
  try {
    const response = await axios.get(`/articles?page=${pageParam}`);

    const articles = response.data || [];
    const hasMore = articles.length > 0;

    return {
      data: articles,
      nextPage: hasMore ? pageParam + 1 : undefined,
    };
  } catch (err) {
    console.error("Error fetching news:", err);
    throw err;
  }
};

export default function NewsPage() {
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
    queryKey: ["news"],
    queryFn: fetchNews,
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

  if (isLoading) {
    return (
      <div className="my-5 text-center text-white opacity-70">Loading...</div>
    );
  }

  if (status === "error") {
    return (
      <div className="my-5 text-center text-white opacity-70">
        Error loading news: {error?.message}
      </div>
    );
  }

  const allNews = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div>
      <NewsList news={allNews} />

      {/* --- Loading/Trigger Area --- */}
      <div
        ref={ref}
        className="h-[50px] my-5 text-center text-white opacity-70"
      >
        {isFetchingNextPage ? (
          <span>Loading more news...</span>
        ) : hasNextPage ? (
          <span>Scroll down to load more...</span> // Optional: Hide this text if you prefer a silent trigger
        ) : (
          <span>No more news to load.</span>
        )}
      </div>
    </div>
  );
}
