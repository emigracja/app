import {ReactElement} from 'react';
import Image from "next/image";
import home from "../../../public/icons/home.svg";
import stocks from "../../../public/icons/stocks.svg";
import wallet from "../../../public/icons/wallet.svg";

const NavBar = (): ReactElement => {
    const icons = [
        {src: home, alt: "home"},
        {src: stocks, alt: "stocks"},
        {src: wallet, alt: "wallet"}
    ];
    return (
        <nav className="absolute bottom-0 flex w-full justify-center align-center box-border bg-white/5">
            <ul className="flex gap-8 py-2 mb-2">
                {icons.map((icon, index) => (
                    <li key={index}>
                        <button className="p-3 rounded-xl active:bg-white/10">
                            <Image className="select-none pointer-events-none" src={icon.src} alt={icon.alt}/>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavBar;