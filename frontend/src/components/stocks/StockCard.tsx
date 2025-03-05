import {ReactElement} from "react";

interface Props {
    children: string;
}

const StockCard = (): ReactElement => (
    <div className={"bg-white/20 p-1 rounded-xl text-sm"}>
        <span>hejka tu lenka</span>
    </div>
)

export default StockCard;