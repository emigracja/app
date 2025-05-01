import { ReactElement } from "react";

interface Props {
  symbol: string;
  name: string;
}

const StockName = ({ symbol, name }: Props): ReactElement => (
  <div className="text-white">
    <h3 className="text-2xl font-bold leading-none">{symbol}</h3>
    <p className="text-xs leading-none text-gray-400">{name}</p>
  </div>
);

export default StockName;
