import { ReactElement } from "react";

interface Props {
  shortcut: string;
  title: string;
}

const StockName = ({ shortcut, title }: Props): ReactElement => (
  <div className="text-white">
    <h3 className="text-2xl font-bold leading-none">{shortcut}</h3>
    <p className="text-xs leading-none text-gray-400">{title}</p>
  </div>
);

export default StockName;
