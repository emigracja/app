import { ReactElement } from "react";
import { Stock } from "@/types/stocks";
import StockCard from "./StockCard";

interface Props {
  stocks: Stock[];
}

const StockList = ({ stocks }: Props): ReactElement => {
  return (
    <div
      className="flex flex-col gap-10 p-2 h-full"
      style={{
        backgroundColor: "transparent",
      }}
    >
      {stocks.map((stock) => (
        <StockCard key={stock.id} {...stock} />
      ))}
    </div>
  );
};

export default StockList;
