import {ReactElement} from "react";
import Image from "next/image";
import home from "../../../public/icons/home.svg";
import stocks from "../../../public/icons/stocks.svg";
import wallet from "../../../public/icons/wallet.svg";
import ai from "../../../public/icons/ai.svg";
import Link from "next/link";

const NavBar = (): ReactElement => {
    const icons = [
        {src: home, alt: "news"},
        {src: stocks, alt: "stocks"},
        {src: ai, alt: "ai"},
        {src: wallet, alt: "wallet"}
    ];
    return (
        <nav className="flex w-full justify-center align-center box-border bg-white/5 h-[80px]">
            <ul className="flex gap-8 py-2 mb-2">
                {icons.map((icon, index) => (
                    <li key={index}>
                        <button className="p-3 rounded-xl active:bg-white/10">
                            <Link href={`/${icon.alt}`}>
                                <Image
                                    className="select-none pointer-events-none"
                                    src={icon.src}
                                    alt={icon.alt}
                                />
                            </Link>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavBar;
