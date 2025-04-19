import { create } from "zustand";
import { Stock } from "@/types/stocks";
import { stocks, news, defaultSettings, users } from "./data";
import { News } from "@/types/news";
import { AppSettings } from "@/types/appSettings";
import { User } from "@/types/users";

export interface DataState {
  stocks: Stock[];
  news: News[];
  settings: AppSettings;
  users: User[];
}

const useDataStore = create<DataState>(() => ({
  stocks: stocks,
  news: news,
  settings: defaultSettings,
  users: users,
}));

export default useDataStore;
