"use client";

import useStore from "@/store/useStore";
import useUserStore from "@/store/useUserStore";
import { AppSettings, SettingsGroupInt } from "@/types/appSettings";
import { useRef, useEffect } from "react";
import SettingsGroup from "./SettingsGroup";

const SettingsMenu = () => {
  const settingsOpen = useStore((state) => state.settingsOpen);
  // const [settings, changeSetting] = useUserStore((state) => [
  //   state.settings,
  //   state.changeSetting,
  // ]);
  const { settings, changeSetting } = useUserStore.getState();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const settingsArray = new Array<SettingsGroupInt>();

  let key: keyof AppSettings;
  for (key in settings) {
    settingsArray.push(settings[key]);
  }

  useEffect(() => {
    if (menuRef.current) {
      if (settingsOpen) {
        menuRef.current.classList.remove("hidden");
        menuRef.current.classList.add("flex");
      } else {
        menuRef.current.classList.remove("flex");
        menuRef.current.classList.add("hidden");
      }
    }
  }, [settingsOpen]);

  return (
    <div
      ref={menuRef}
      className="text-white hidden w-full h-full overflow-auto flex-col"
    >
      {settingsArray.map((group) => {
        return <SettingsGroup {...group} key={group.name} />;
      })}
      <div className="h-[130px]"></div>
    </div>
  );
};

export default SettingsMenu;
