"use client";
import React, { useEffect, useState } from "react";
import Drawer from "@/components/drawer/Drawer";
import Card from "@/components/news/Card";
import axios from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader/Loader";
import StockList from "@/components/stocks/StockList";
import useUserStockStore from "@/store/useUserStockStore";
import { Stock } from "@/types/stocks";

const fetchNewsWithStocks = async (slug: string) => {
  const response = await axios.get(`/articles/slug/${slug}`);
  const newsData = response.data;

  const updatedStocks = await Promise.all(
    newsData.stocks.map(async (symbol: string) => {
      const stockResponse = await axios.get(`/stocks?symbol=${symbol}`);
      return stockResponse.data[0];
    })
  );

  newsData.stocks = updatedStocks;
  return newsData;
};

const NewsDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const [selectedDrawer, setSelectedDrawer] = useState<string | null>(null);
  const [userStocksFiltered, setUserStocksFiltered] = useState([]);
  const userStocks = useUserStockStore((state) => state.userStocks);
  const updateUserStocks = useUserStockStore((state) => state.updateUserStocks);

  const { data, isLoading } = useQuery({
    queryKey: ["news", id],
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, currentSlug] = queryKey as [string, string];
      if (!currentSlug) {
        throw new Error("Slug is required to fetch news.");
      }
      return fetchNewsWithStocks(currentSlug);
    },
  });

  useEffect(() => {
    if (!data || userStocks.length === 0) return;

    const userSymbols = userStocks.map((s) => s.symbol);
    setUserStocksFiltered(
      data.stocks.filter((s: Stock) => userSymbols.includes(s.symbol))
    );
  }, [data, userStocks]);

  useEffect(() => {
    updateUserStocks();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const handleDrawerChange = (id: string) => {
    setSelectedDrawer(selectedDrawer === id ? null : id);
  };

  console.log(userStocksFiltered);

  return (
    <div
      className="flex flex-col p-2 h-100vh overflow-auto"
      style={{ backgroundColor: "transparent" }}
    >
      <Card
        slug={data.slug}
        id={null}
        title={data.title}
        publishedAt={data.publishedAt}
        affectedStocks={null}
        stocks={[]}
        author={data.author}
        backgroundImage={data.backgroundImage}
      />
      <article className="relative block text-[13px] text-white mt-10 rounded-xl p-3 box-content bg-white/10 text-justify">
        {data.description}
        <br />
        <a className="text-blue-400" href={data.url}>
          Read More...
        </a>
      </article>
      <div className={"flex flex-col gap-2 overflow-hidden"}>
        <Drawer
          id={"t"}
          text={`YOUR AFFECTED STOCKS (${userStocksFiltered.length})`}
          open={selectedDrawer === "t"}
          onChange={handleDrawerChange}
        >
          <StockList partialStocks={userStocksFiltered}></StockList>
        </Drawer>
        <Drawer
          id={"y"}
          text={`AFFECTED STOCKS (${data.stocks.length})`}
          open={selectedDrawer === "y"}
          onChange={handleDrawerChange}
        >
          <StockList partialStocks={data.stocks}></StockList>
        </Drawer>
      </div>
    </div>
  );
};

export default NewsDetails;
