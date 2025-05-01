'use client'
import { useState } from 'react';
import Drawer from '@/components/drawer/Drawer';
import Card from '@/components/news/Card';
import axios from "@/utils/axios";
import {useQuery} from "@tanstack/react-query";

const news = {
    id: "1",
    title: "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
    publishedAt: "1741209855234",
    author: "New York Times",
    affectedStocks: 2,
    text: "Prime Minister Justin Trudeau of Canada on Tuesday harshly condemned the tariffs that President Trump imposed on Canada, as well as Mexico and China, saying in a televised address that they would hurt people on both sides of the U.S.- Canadian border and that Canada would “relentlessly fight” to protect its economy. 2 minutes ago 55 minutes ago Canada and China quickly announced retaliatory tariffs after the U.S. levies — an ter midnight on Monday. Mexico said it could impose its own countermeasures by Sunday. The moves driving down stock prices and worrying global markets...",
    tags: ["TAG1", "TAG2"],
}

type NewsProps = {
    params: {
        id: string;
    };
};

const fetchNews = async (slug: string) => {
    const response = await axios.get(`/articles/slug/${slug}`);
    return response.data;
};

 const NewsDetails = ({params}: NewsProps) => {
    const [selectedDrawer, setSelectedDrawer] = useState<string | null>(null);

     const { data, isLoading } = useQuery({
         queryKey: ['news', params.id],
         queryFn: async ({ queryKey }) => {
             // eslint-disable-next-line @typescript-eslint/no-unused-vars
             const [_, currentSlug] = queryKey as [string, string];
             if (!currentSlug) {
                 throw new Error("Slug is required to fetch news.");
             }
             return fetchNews(currentSlug);
         },
     });

     if(isLoading) {
         return <div>
             Loading...
         </div>
     }

    const handleDrawerChange = (id: string) => {
        setSelectedDrawer(selectedDrawer === id ? null : id);
    }

    return (
        <div className="flex flex-col p-2 h-100vh overflow-auto" style={{ backgroundColor: "transparent" }}>
            <Card slug={data.slug} id={null} title={data.title} publishedAt={data.publishedAt} affectedStocks={null} stocks={[]} author={data.author} />
            <article className="relative block text-[13px] text-white mt-10 rounded-xl p-3 box-content bg-white/10 text-justify">
                {data.description}
                <br/>
                <a className="text-blue-400" href={data.url}>Read More...</a>
            </article>
            <div className={"flex flex-col gap-2 overflow-hidden"}>
                <Drawer id={"t"} text="YOUR AFFECTED STOKS (2)" open={selectedDrawer === "t"} onChange={handleDrawerChange}>
                    <div className={"flex flex-col gap-2  h-full"}>
                        <p className={"text-white font-bold"}>AAPL</p>
                        <p className={"text-white font-bold"}>GOOGL</p>
                    </div>
                </Drawer>
                <Drawer id={"y"} text="AFFECTED STOKS (8)" open={selectedDrawer === "y"} onChange={handleDrawerChange} >
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
}

export default NewsDetails;