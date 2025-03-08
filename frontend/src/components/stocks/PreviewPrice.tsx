import { Currency } from "@/types/stocks";
import { ReactElement } from "react";

interface Props {
  price: number;
  todaysPriceChange: number;
  currency: Currency;
}

const PreviewPrice = ({
  price,
  todaysPriceChange,
  currency,
}: Props): ReactElement<Props> => (
  <div className="flex items-end flex-col">
    <div className="flex">
      <p className="text-2xl font-bold">{price}</p>
      <p className="text-2xl ml-2">{currency}</p>
    </div>
    <div
      className={`${
        todaysPriceChange < 0 ? "bg-stock-red" : "bg-stock-green"
      } py-0.5 px-3 leading-none font-bold rounded-sm text-sm`}
    >
      <p>
        {todaysPriceChange > 0 ? "+" : ""}
        {todaysPriceChange}
      </p>
    </div>
  </div>
);

export default PreviewPrice;
