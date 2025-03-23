import { create } from "zustand";
import { Stock } from "@/types/stocks";
import { stocks, news, defaultSettings } from "./data";
import { News } from "@/types/news";
import { AppSettings } from "@/types/appSettings";

export interface DataState {
  stocks: Stock[];
  news: News[];
  settings: AppSettings;
}

const useDataStore = create<DataState>(() => ({
  stocks: stocks,
  news: news,
  settings: defaultSettings,
}));

export default useDataStore;
