"use client";

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
    console.log(response.data);
    return response.data;
  } catch (err) {
    throw new Error(`Error fetching articles: ${err}`);
  }
};

const fetchStocks = async () => {
  try {
    const response = await axiosInstance.get(`/user/stocks`);
    console.log(response.data);
    return response.data;
  } catch (err) {
    throw new Error(`Error fetching stocks: ${err}`);
  }
};

const Wallet = () => {
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

  const isLoading = newsQuery.isLoading || stocksQuery.isLoading;
  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="flex flex-col w-screen h-full grid-rows-2 text-white p-2 gap-1">
      <h2 className="font-bold text-lg">Your stocks ({stocks.length})</h2>
      <section className="h-[50%] overflow-auto">
        <StockList partialStocks={stocks} />
      </section>
      <div className="flex justify-between alight-center">
        <h2 className="font-bold text-lg">Affecting news</h2>
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
      <section className="h-[50%] overflow-auto">
        <NewsList news={news} />
      </section>
    </section>
  );
};

export default Wallet;
