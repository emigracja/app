import { ReactElement } from "react";
import { Currency, Period, CandlestickData } from "@/types/stocks";
import Image from "next/image";
import favEmpty from "../../../public/icons/favEmpty.svg";
import notfication from "../../../public/icons/notfication.svg";
import PreviewChart from "./PreviewChart";
import PreviewPrice from "./PreviewPrice";
import StockName from "./StockName";

interface Props {
  id: string;
  title: string;
  shortcut: string;
  currency: Currency;
  market: string;
  price: number;
  todaysPriceChange: number;
  currentPeriod: Period;
  tags: string[];
  periodPrices: CandlestickData[];
}

const StockCard = ({
  id,
  title,
  shortcut,
  currency,
  // market,
  price,
  todaysPriceChange,
  // tags,
  periodPrices,
}: Props): ReactElement => {
  return (
    <section className="relative block text-xl text-white rounded-xl p-3 box-content bg-card-bg">
      <a href={`/stocks/${id}`}>
        <div className="flex flex-row gap-3 items-start h-full">
          <div className="flex flex-col w-full gap-5 basis-2/3 grow">
            <StockName title={title} shortcut={shortcut} />
            <PreviewChart CandlestickData={periodPrices} id={id} />
          </div>
          <div className="basis-1/3 grow flex flex-col items-end justify-between h-full">
            <PreviewPrice
              price={price}
              todaysPriceChange={todaysPriceChange}
              currency={currency}
            />
            <div className="flex flex-end">
              <Image
                className="box-border mr-2 rounded-xl active:bg-white/5"
                src={notfication}
                alt="favEmpty"
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
          </div>
        </div>
      </a>
    </section>
  );
};

export default StockCard;
