"use client";

import { ReactElement } from "react";
import { Currency, Period, CandlestickData } from "@/types/stocks";
import Image from "next/image";
import favEmpty from "../../../public/icons/favEmpty.svg";
import favFilled from "../../../public/icons/favFilled.svg";
import PreviewChart from "./PreviewChart";
import PreviewPrice from "./PreviewPrice";
import StockName from "./StockName";
import useUserStockStore from "@/store/useUserStockStore";

interface Props {
  id: string;
  name: string;
  symbol: string;
  currency: Currency;
  exchange: string;
  ekd: string;
  price: number;
  todaysPriceChange: number;
  currentPeriod: Period;
  tags: string[];
  periodPrices: CandlestickData[];
  favorite: boolean;
}

const StockCard = ({
  id,
  name,
  symbol,
  currency,
  // market,
  price,
  todaysPriceChange,
  // tags,
  periodPrices,
  favorite,
}: Props): ReactElement => {
  const { addUserStock, removeUserStock } = useUserStockStore();
  return (
    <section className="relative block text-xl text-white rounded-xl p-3 box-content bg-card-bg">
      <a href={`/stocks/${symbol}`}>
        <div className="flex flex-row gap-3 items-start h-full">
          <div className="flex flex-col w-full gap-5 basis-2/3 grow">
            <StockName name={name} symbol={symbol} />
            <PreviewChart CandlestickData={periodPrices} id={id} />
          </div>
          <div className="basis-1/3 grow flex flex-col items-end justify-between h-full">
            <PreviewPrice
              price={price}
              todaysPriceChange={todaysPriceChange}
              currency={currency}
            />
          </div>
        </div>
      </a>
      <div className="absolute right-2 bottom-3 flex flex-end">
        <Image
          className="box-border rounded-xl active:bg-white/5 z-10"
          onClick={(e) => {
            e.stopPropagation();
            if (favorite) {
              removeUserStock(symbol);
            } else {
              addUserStock(symbol);
            }
          }}
          src={favorite ? favFilled : favEmpty}
          alt="favEmpty"
          height={40}
          width={40}
        />
      </div>
    </section>
  );
};

export default StockCard;
