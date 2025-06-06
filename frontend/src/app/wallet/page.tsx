"use client";

import { useState, useRef, useEffect } from "react";
import StockList from "@/components/stocks/StockList";
import NewsList from "@/components/news/NewsList";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import filter from "../../../public/icons/filter.svg";
import Loader from "@/components/loader/Loader";
import axiosInstance from "@/utils/axios";

const fetchNews = async () => {
  try {
    const response = await axiosInstance.get(`/user/articles`);
    return response.data;
  } catch (err) {
    throw new Error(`Error fetching articles: ${err}`);
  }
};

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

  const newsQuery = useQuery({
    queryKey: ["usernews"],
    queryFn: fetchNews,
  });
  const news = newsQuery.data;

  const stocksQuery = useQuery({
    queryKey: ["userstocks"],
    queryFn: fetchStocks,
  });
  const stocks = stocksQuery.data;

  useEffect(() => {
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

    if (scrollContainer.current) {
      scrollContainer.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContCurrent) {
        scrollContCurrent.removeEventListener("scroll", handleScroll);
      }
    };
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
                />
              </Link>
            </div>
            <NewsList news={news} />
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
