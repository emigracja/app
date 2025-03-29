"use client";
import Image from "next/image";
import back from "../../../public/icons/back.svg";
import logo from "../../../public/icons/logo.svg";
import settings from "../../../public/icons/settings.svg";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Use next/navigation for client components

const TopBar = () => {
  const router = useRouter(); // Using the Next.js 13 useRouter hook

  // Function to handle back navigation
  const handleBack = () => {
    router.back(); // Navigates to the previous page
  };


  return (
    <nav className="flex h-[50px] justify-between items-center p-1">
      <div onClick={handleBack} className="cursor-pointer">
        <Image
          className="p-2 box-border rounded-xl active:bg-white/5"
          src={back}
          alt="back"
          height={40}
          width={40}
        />
      </div>
      <Image
        className="justify-self-center opacity-75"
        src={logo}
        alt="logo"
        height={50}
        width={50}
      />
      <Link
        className="p-1 box-border rounded-xl active:bg-white/5 h-50px w-50px"
        href="/settings"
      >
        <Image
          className="p-1 justify-self-center opacity-75"
          src={settings}
          alt="settings"
          height={40}
          width={40}
        />
      </Link>
    </nav>
  );
};

export default TopBar;
