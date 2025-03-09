import { Currency } from "@/types/stocks";
import { ReactElement } from "react";
import PriceChange from "./PriceChange";

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
    <PriceChange todaysPriceChange={todaysPriceChange} />
  </div>
);

export default PreviewPrice;
