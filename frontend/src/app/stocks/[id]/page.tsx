"use client";

import StockName from "@/components/stocks/StockName";
import Image from "next/image";
import favEmpty from "../../../../public/icons/favEmpty.svg";
import notfication from "../../../../public/icons/notfication.svg";
import { Stock, CandlestickData } from "@/types/stocks";
import MainChart from "@/components/stocks/MainChart";
import PriceChange from "@/components/stocks/PriceChange";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import useDataStore from "@/store/useDataStore";
import NewsList from "@/components/news/NewsList";

export default function StockDetail() {
  const params = useParams();
  const id = params.id;
  const stock = useDataStore((state) => state.stocks).filter(
    (s) => s.id == id
  )[0];
  const news = useDataStore((state) => state.news);

  const [isNews, setIsNews] = useState(false);
  const chartSection = useRef<HTMLDivElement | null>(null);
  const newsSection = useRef<HTMLDivElement | null>(null);
  const chartButton = useRef<HTMLButtonElement | null>(null);
  const newsButton = useRef<HTMLButtonElement | null>(null);
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

  if (!stock || !news) {
    return (
      <div className="h-full w-full text-white flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-auto">
      <section className="flex justify-between w-full p-5">
        <StockName title={stock.title} shortcut={stock.shortcut} />
        <div className="flex flex-end">
          <Image
            className="box-border mr-2 rounded-xl active:bg-white/5"
            src={notfication}
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
      <section className="grow" ref={chartSection}>
        <MainChart CandlestickData={stock.periodPrices} />
      </section>
      <section ref={newsSection} className="grow overflow-auto hidden">
        <NewsList news={news} />
      </section>
      <section className="flex justify-center items-center gap-1 p-2">
        <button
          ref={chartButton}
          className="h-full grow text-white uppercase text-xl text-center border-e py-2 font-bold"
          onClick={() => setIsNews(false)}
        >
          <p>Chart</p>
        </button>
        <button
          ref={newsButton}
          className="h-full grow text-white uppercase text-xl text-center border-s py-2"
          onClick={() => setIsNews(true)}
        >
          <p>News</p>
        </button>
      </section>
    </div>
  );
}
