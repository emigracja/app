import {ReactElement} from "react";

interface Props {
    children: string;
}

const Tag = ({ children }: Props): ReactElement<Props> => (
    <div className={"bg-white/20 p-1 rounded-xl text-sm"}>
        <span>{children}</span>
    </div>
)

export default Tag;