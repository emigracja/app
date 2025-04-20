"use client";

import StockName from "@/components/stocks/StockName";
import Image from "next/image";
import favEmpty from "../../../../public/icons/favEmpty.svg";
import notification from "../../../../public/icons/notification.svg";
import { Stock, CandlestickData } from "@/types/stocks";
import MainChart from "@/components/stocks/MainChart";
import PriceChange from "@/components/stocks/PriceChange";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import useDataStore from "@/store/useDataStore";
import NewsList from "@/components/news/NewsList";
import {periods} from "@/storage/default/chats";

export default function StockDetail() {
  const params = useParams();
  const id = params.id;
  const stock = useDataStore((state) => state.stocks).filter(
    (s) => s.id == id
  )[0];
  const news = useDataStore((state) => state.news);

  const [isNews, setIsNews] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const chartSection = useRef<HTMLDivElement | null>(null);
  const newsSection = useRef<HTMLDivElement | null>(null);
  const chartButton = useRef<HTMLButtonElement | null>(null);
  const newsButton = useRef<HTMLButtonElement | null>(null);
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      !chartSection.current ||
      !newsSection.current ||
      !chartButton.current ||
      !newsButton.current
    )
      return;
    const chartClasses = chartSection.current.classList;
    const newsClasses = newsSection.current.classList;
    const chartButtonClasses = chartButton.current.classList;
    const newsButtonClasses = newsButton.current.classList;
    if (isNews) {
      newsClasses.remove("hidden");
      newsButtonClasses.add("font-bold");
      chartClasses.add("hidden");
      chartButtonClasses.remove("font-bold");
    } else {
      chartClasses.remove("hidden");
      chartButtonClasses.add("font-bold");
      newsClasses.add("hidden");
      newsButtonClasses.remove("font-bold");
    }
  }, [isNews]);

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

    if (scrollContainer.current) {
      scrollContainer.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer.current) {
        scrollContainer.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  if (!stock || !news) {
    return (
      <div className="h-full w-full text-white flex justify-center items-center">
        <p>Loading...</p> {/* TODO: Add spinner and lazy loading */}
      </div>
    );
  }

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

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden">
      <section className="flex justify-between w-full p-5">
        <StockName title={stock.title} shortcut={stock.shortcut} />
        <div className="flex flex-end">
          <Image
            className="box-border mr-2 rounded-xl active:bg-white/5"
            src={notification}
            alt="notification"
            height={40}
            width={40}
          />
          <Image
            className="box-border rounded-xl active:bg-white/5"
            src={favEmpty}
            alt="favEmpty"
            height={40}
            width={40}
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
        className="relative flex overflow-x-scroll scrollbar-hide pb-10 snap-x snap-mandatory"
      >
        <div className="flex w-[200vw] box-border justify-between px-1">
          <div className="w-[100vw] box-border snap-center">
            <MainChart CandlestickData={stock.periodPrices} />
          </div>
        </section>
        <section ref={scrollContainer}
                 className="relative flex overflow-x-scroll scrollbar-hide pb-10 snap-x snap-mandatory">
          <div className="flex w-[200vw] box-border justify-between px-1">
            <div className="flex flex-col align-middle gap-2 w-[100vw] box-border snap-center">
              <div className="flex justify-end ">
                <div className="text-white flex gap-2 items-center mr-4">
                  <label>
                    Period:
                  </label>
                  <select
                      style={{ WebkitAppearance: 'none', MozAppearance: 'none', textAlignLast: 'center' }}
                      className="block bg-transparent border border-gray-600 rounded-md p-1 text-center appearance-none focus:outline-none focus:border-gray-400 pr-6"
                  >
                    {periods.map(period => (
                        <option key={period} value={period} className="bg-gray-900">{period}</option>
                    ))}
                  </select>
                </div>
              </div>
              <MainChart CandlestickData={stock.periodPrices} />
            </div>
            <div className="w-[100vw] overflow-y-scroll box-border snap-center px-1">
              <NewsList news={news}/>
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
