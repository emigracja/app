'use client'

import Image from "next/image";
import arrow from "../../../public/icons/play.svg";
import {ReactElement} from "react";

const Drawer = ({ id, text,  open, children, onChange }: { id: string,text: string, open: boolean, onChange: (id: string) => void , children: ReactElement | ReactElement[]}) => {
    return (
        <div>
            <label htmlFor={id} className="flex justify-between w-full font-bold p-2 bold  text-white border-b border-white/20 active:bg-white/5">
                <span>
                    {text}
                </span>
                <Image className={`${open ? "rotate-180" : ""}`} src={arrow} alt={arrow} />
            </label>
            <div className='overflow-scroll h-full'>
               {open && children}
            </div>
            <input
                id={id}
                name="drawer"
                className={`w-0 h-0 absolute`}
                type="checkbox"
                checked={open}
                onChange={() => onChange(id)}
            />
        </div>
    );
};

export default Drawer;