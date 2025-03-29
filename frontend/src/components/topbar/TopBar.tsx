"use client";
import Image from "next/image";
import back from "../../../public/icons/back.svg";
import logo from "../../../public/icons/logo.svg";
import search from "../../../public/icons/search.svg";
import settings from "../../../public/icons/settings.svg";
import filter from "../../../public/icons/filter.svg";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import Link from "next/link";

const TopBar = () => {
  const router = useRouter();
    const pathname = usePathname();

  const handleBack = () => {
    router.back();
  };

  const shouldShowSettings = pathname === '/wallet';
  const shouldShowSearch = pathname === '/stocks';
  const shouldShowFilter = pathname === '/news';

  const shouldShowButton = shouldShowSettings || shouldShowSearch || shouldShowFilter;

    const buttonRoute = (() => {
        switch (pathname) {
            case '/wallet':
                return '/settings';
            case '/stocks':
                return '?search';
            case '/news':
                return '?filters';
            default:
                return '';
        }
    })();


    const buttonIcon = (() => {
        switch (pathname) {
            case '/wallet':
                return settings;
            case '/stocks':
                return search;
            case '/news':
                return filter;
            default:
                return '';
        }
    })();

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
        className={`p-1 box-border rounded-xl active:bg-white/5 h-50px w-50px ${ shouldShowButton ? 'visible' : 'invisible' }`}
        href={buttonRoute}
      >
        <Image
          className="p-1 justify-self-center opacity-75"
          src={buttonIcon}
          alt="settings"
          height={40}
          width={40}
        />
      </Link>
    </nav>
  );
};

export default TopBar;
