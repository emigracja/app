"use client";
import React, { useState } from "react";
import Drawer from "@/components/drawer/Drawer";
import Card from "@/components/news/Card";
import axios from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader/Loader";

const fetchNews = async (slug: string) => {
  const response = await axios.get(`/articles/slug/${slug}`);
  return response.data;
};

const NewsDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const [selectedDrawer, setSelectedDrawer] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["news", id],
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, currentSlug] = queryKey as [string, string];
      if (!currentSlug) {
        throw new Error("Slug is required to fetch news.");
      }
      return fetchNews(currentSlug);
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  const handleDrawerChange = (id: string) => {
    setSelectedDrawer(selectedDrawer === id ? null : id);
  };

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
          text="YOUR AFFECTED STOKS (2)"
          open={selectedDrawer === "t"}
          onChange={handleDrawerChange}
        >
          <div className={"flex flex-col gap-2  h-full"}>
            <p className={"text-white font-bold"}>AAPL</p>
            <p className={"text-white font-bold"}>GOOGL</p>
          </div>
        </Drawer>
        <Drawer
          id={"y"}
          text="AFFECTED STOKS (8)"
          open={selectedDrawer === "y"}
          onChange={handleDrawerChange}
        >
          <div className={"flex flex-col gap-2 overflow-scroll h-[90%]"}>
            <p className={"text-white font-bold"}>AAPL</p>
            <p className={"text-white font-bold"}>GOOGL</p>
            <p className={"text-white font-bold"}>AAPL</p>
            <p className={"text-white font-bold"}>GOOGL</p>
            <p className={"text-white font-bold"}>AAPL</p>
            <p className={"text-white font-bold"}>GOOGL</p>
            <p className={"text-white font-bold"}>AAPL</p>
            <p className={"text-white font-bold"}>GOOGL</p>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default NewsDetails;
