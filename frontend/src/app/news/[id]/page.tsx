'use client'
import { useState } from 'react';
import Drawer from '@/components/drawer/Drawer';
import Card from '@/components/news/Card';

const news = {
    id: "1",
    title: "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
    publishedAt: "1741209855234",
    author: "New York Times",
    affectedStocks: 2,
    imageUri: "/images/image.png",
    text: "Prime Minister Justin Trudeau of Canada on Tuesday harshly condemned the tariffs that President Trump imposed on Canada, as well as Mexico and China, saying in a televised address that they would hurt people on both sides of the U.S.- Canadian border and that Canada would “relentlessly fight” to protect its economy. 2 minutes ago 55 minutes ago Canada and China quickly announced retaliatory tariffs after the U.S. levies — an ter midnight on Monday. Mexico said it could impose its own countermeasures by Sunday. The moves driving down stock prices and worrying global markets...",
    tags: ["TAG1", "TAG2"],
}

 const NewsDetails = () => {
    const [selectedDrawer, setSelectedDrawer] = useState<string | null>(null);

    const handleDrawerChange = (id: string) => {
        setSelectedDrawer(selectedDrawer === id ? null : id);
    }

    return (
        <div className="flex flex-col p-2 h-full overflow-hidden" style={{ backgroundColor: "transparent" }}>
            <Card id={null} title={news.title} publishedAt={news.publishedAt} affectedStocks={null} tags={news.tags} author={news.author} imageUri={news.imageUri} />
            <article className="relative block text-[13px] text-white mt-10 rounded-xl p-3 box-content bg-white/10 text-justify">
                {news.text}
            </article>
            <div className={"flex flex-col gap-2"}>
                <Drawer id={"t"} text="YOUR AFFECTED STOKS (2)" open={selectedDrawer === "t"} onChange={handleDrawerChange}>
                    <div className={"flex flex-col gap-2"}>
                        <p className={"text-white font-bold"}>AAPL</p>
                        <p className={"text-white font-bold"}>GOOGL</p>
                    </div>
                </Drawer>
                <Drawer id={"y"} text="AFFECTED STOKS (8)" open={selectedDrawer === "y"} onChange={handleDrawerChange} >
                    <div className={"flex flex-col gap-2"}>
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