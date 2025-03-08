import { ReactElement } from "react";
import { Currency, Period, CandlestickData } from "@/types/stocks";
import Tag from "@/components/news/Tag";
import PreviewChart from "./PreviewChart";

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
  market,
  price,
  todaysPriceChange,
  tags,
  periodPrices,
}: Props): ReactElement => {
  return (
    <a
      className="relative block text-xl text-white rounded-xl p-3 box-content bg-cardbg"
      href={`/news/${id}`}
    >
      <section className="flex flex-row gap-5 items-start">
        <section className="flex flex-col w-full gap-5">
          <h3>{title}</h3>
          <p>{shortcut}</p>
          <PreviewChart CandlestickData={periodPrices} id={id} />
        </section>
        <section>
          <p>test</p>
        </section>
      </section>
    </a>
  );
};

export default StockCard;
