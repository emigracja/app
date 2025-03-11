import { create } from "zustand";
import { Stock } from "@/types/stocks";
import { stocks } from "./data";
import { News } from "@/types/news";
import { news } from "./data";

export interface DataState {
  stocks: Stock[];
  news: News[];
}

const useDataStore = create<DataState>((set) => ({
  stocks: stocks,
  news: news,
}));

export default useDataStore;
