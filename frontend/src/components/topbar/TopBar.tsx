'use client'
import Image from "next/image";
import back from "../../../public/icons/back.svg";
import logo from "../../../public/icons/logo.svg";
import { useRouter } from "next/navigation"; // Use next/navigation for client components

const TopBar = () => {
    const router = useRouter();  // Using the Next.js 13 useRouter hook

    // Function to handle back navigation
    const handleBack = () => {
        router.back();  // Navigates to the previous page
    }

    return (
        <nav className="flex h-[50px] justify-between items-center px-1 py-1">
            <div onClick={handleBack} className="cursor-pointer">
                <Image className="p-2 box-border rounded-xl active:bg-white/5" src={back} alt='back' height={40} width={40}/>
            </div>
            <Image className="justify-self-center opacity-75" src={logo} alt="logo" height={50} width={50}/>
            <div className="p-2 box-border rounded-xl active:bg-white/5" style={{ height: '40px', width: '40px' }}></div>
        </nav>
    )
}

export default TopBar;
