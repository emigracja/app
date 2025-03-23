import { create } from "zustand";
import { defaultSettings } from "./data";
import { AppSettings } from "@/types/appSettings";

export interface UserState {
  settings: AppSettings;
  changeSetting: <K extends keyof AppSettings>(
    groupName: K,
    settingName: string,
    newValue: string
  ) => void;
}

const useUserStore = create<UserState>((set) => ({
  settings: defaultSettings,
  changeSetting: (groupName, settingName, newValue) => {
    set((state) => {
      const newSettings = { ...state.settings };
      const settingToChange = newSettings[groupName].settings.filter(
        (x) => x.name === settingName
      )[0];
      if (settingToChange) {
        settingToChange.value = newValue;
      }
      return { settings: newSettings };
    });
  },
}));

export default useUserStore;
