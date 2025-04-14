"use client";
import Image from "next/image";
import back from "../../../public/icons/back.svg";
import logo from "../../../public/icons/logo.svg";
import settings from "../../../public/icons/settings.svg";
import filter from "../../../public/icons/filter.svg";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  NEWS_ROUTE,
  SETTINGS_ROUTE,
  STOCKS_ROUTE,
  WALLET_ROUTE,
} from "@/types/routes";

const TopBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    router.back();
  };

  const shouldShowSettings = pathname === WALLET_ROUTE;
  const shouldShowFilter = pathname === NEWS_ROUTE || pathname === STOCKS_ROUTE;

  const shouldShowButton = shouldShowSettings || shouldShowFilter;

  const routeConfig = {
    [WALLET_ROUTE]: {
      route: SETTINGS_ROUTE,
      icon: settings,
    },
    [NEWS_ROUTE]: {
      route: "?filters",
      icon: filter,
    },
    [STOCKS_ROUTE]: {
      route: "?filters",
      icon: filter,
    },
    default: {
      route: "",
      icon: null,
    },
  };

  const buttonData = routeConfig[pathname] || routeConfig.default;

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
        className={`p-1 box-border rounded-xl active:bg-white/5 h-50px w-50px ${
          shouldShowButton ? "visible" : "invisible"
        }`}
        href={buttonData.route}
      >
        <Image
          className="p-1 justify-self-center opacity-75"
          src={buttonData.icon}
          alt="settings"
          height={40}
          width={40}
        />
      </Link>
    </nav>
  );
};

export default TopBar;
