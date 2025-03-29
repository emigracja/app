"use client";

import StockList from "@/components/stocks/StockList";
import NewsList from "@/components/news/NewsList";
import useDataStore from "@/store/useDataStore";
import Link from "next/link";
import Image from "next/image";
import filter from "../../../public/icons/filter.svg";

const Wallet = () => {
    const {stocks, news} = useDataStore((state) => state);
    return (
        <section className="flex flex-col w-screen h-full grid-rows-2 text-white p-2 gap-1">
            <h2 className="font-bold text-lg">Your stocks ({stocks.length})</h2>
            <section className="h-[50%] overflow-auto">
                    <StockList stocks={stocks}/>
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
                <NewsList news={news}/>
            </section>
        </section>
    );
};

export default Wallet;