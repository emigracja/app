"use client";
import Image from "next/image";
import back from "../../../public/icons/back.svg";
import logo from "../../../public/icons/logo.svg";
import settings from "../../../public/icons/settings.svg";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import Link from "next/link";

const TopBar = () => {
  const router = useRouter();
    const pathname = usePathname();

  const handleBack = () => {
    router.back();
  };

  const shouldShowSettings = pathname !== '/settings';

  return (
    <nav className="flex justify-between items-center p-1">
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
        className={`p-1 box-border rounded-xl active:bg-white/5 h-50px w-50px ${ shouldShowSettings ? 'visible' : 'invisible' }`}
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
