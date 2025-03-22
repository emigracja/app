"use client";

import useStore from "@/store/useStore";
import { useRef, useEffect } from "react";

const SettingsMenu = () => {
  const settingsOpen = useStore((state) => state.settingsOpen);
  const menuRef = useRef<HTMLDivElement | null>(null);

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
    <div ref={menuRef} className="text-white hidden">
      <p>siemaneczko</p>
    </div>
  );
};

export default SettingsMenu;
