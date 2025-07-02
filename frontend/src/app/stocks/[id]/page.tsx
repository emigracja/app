"use client";

import StockName from "@/components/stocks/StockName";
import Image from "next/image";
import favEmpty from "../../../../public/icons/favEmpty.svg";
import favFilled from "../../../../public/icons/favFilled.svg";
import { Stock } from "@/types/stocks";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import MainChart from "@/components/stocks/MainChart";
import PriceChange from "@/components/stocks/PriceChange";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import NewsList from "@/components/news/NewsList";
import axios from "@/utils/axios";
import { News } from "@/types/news";
import { BeatLoader } from "react-spinners";
import Loader from "@/components/loader/Loader";
import useUserStockStore from "@/store/useUserStockStore";

interface FetchResponse {
  data: News[];
  nextPage: number | null | undefined; // The page number for the *next* fetch, or null/undefined if no more pages
}

const fetchStock = async (symbol: string): Promise<Stock> => {
  try {
    const stockRes = await axios.get(`/stocks?symbol=${symbol}`);
    const candleRes = await fetch(
      `/api/candles?symbol=${symbol}&interval=1h&limit=500`
    );
    if (!candleRes.ok) throw new Error("Błąd pobierania danych candle");
    if (stockRes.status !== 200)
      throw new Error("Błąd pobierania danych stock");
    const stock = {
      ...stockRes.data[0],
      ...(await candleRes.json()),
      currency: "PLN",
      tags: [stockRes.data[0].ekd],
    };
    return stock as Stock;
  } catch (err) {
    console.error(`Error fetching stock ${symbol}:`, err);
    throw err;
  }
};

export default function StockDetail() {
  const params = useParams();
  const id = params.id as string;
  const { addUserStock, removeUserStock } = useUserStockStore();

  const { ref, inView } = useInView({
    // threshold: 0, // Trigger when the element enters the viewport
    // triggerOnce: false // Keep observing even after it becomes visible once
  });

  const fetchNews = async ({ pageParam = 0 }): Promise<FetchResponse> => {
    const params = new URLSearchParams({
      page: String(pageParam),
    });
    try {
      const response = await axios.get(
        `/articles/stock/${id}?${params.toString()}`
      );

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

  const newsQuery = useInfiniteQuery<FetchResponse, Error>({
    queryKey: ["news", id],
    queryFn: fetchNews,
    getNextPageParam: (lastPage: any) => {
      // lastPage is the result returned by fetchNews for the last page fetched
      return lastPage.nextPage;
    },
  });

  const {
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status, // 'loading', 'error', 'success'
    refetch,
  } = newsQuery;

  const stockQuery = useQuery({
    queryKey: [`stock-${id}`],
    queryFn: () => fetchStock(id),
  });

  const stock = stockQuery.data;
  const news = newsQuery.data;
  const isLoading = stockQuery.isLoading || newsQuery.isLoading;

  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainer = useRef<HTMLDivElement | null>(null);

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
        console.log(`removing ev`);
        scrollContCurrent.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

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

  if (isLoading || !news || !stock) {
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
      <section className="flex justify-between w-full p-5">
        <StockName name={stock.name} symbol={stock.symbol} />
        <div className="flex flex-end">
          <Image
            className="box-border rounded-xl active:bg-white/5"
            src={stock.favorite ? favFilled : favEmpty}
            alt="favEmpty"
            height={40}
            width={40}
            onClick={(e) => {
              e.stopPropagation();
              if (stock.favorite) {
                removeUserStock(stock.symbol);
              } else {
                addUserStock(stock.symbol);
              }
            }}
          />
        </div>
      </section>
      <section className="flex justify-center text-white items-center mb-5">
        <p className="font-bold text-3xl pr-2">{stock.price}</p>
        <p className="text-3xl pr-2">{stock.currency}</p>
        <div className="flex items-center h-full justify-center">
          <PriceChange todaysPriceChange={stock.todaysPriceChange} />
        </div>
      </section>
      <section
        ref={scrollContainer}
        className="relative flex overflow-x-scroll scrollbar-hide pb-10 snap-x snap-mandatory h-full"
      >
        <div className="flex w-[200vw] box-border justify-between px-1">
          <div className="flex flex-col align-middle gap-2 w-[100vw] box-border snap-center">
            <MainChart CandlestickData={stock.periodPrices} />
          </div>
          <div className="w-[100vw] overflow-y-scroll box-border snap-center px-1">
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
}
