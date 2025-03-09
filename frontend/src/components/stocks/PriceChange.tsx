import { ReactElement } from "react";

interface Props {
  todaysPriceChange: number;
}

const PriceChange = ({ todaysPriceChange }: Props): ReactElement<Props> => (
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
);

export default PriceChange;
