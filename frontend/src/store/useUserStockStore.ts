import { create } from "zustand";
import axiosInstance from "@/utils/axios";
import { Stock } from "@/types/stocks";

export interface UserStockStore extends UserStockActions {
    userStocks: Stock[];
}

export interface UserStockActions {
    updateUserStocks: () => Promise<void>;
    addUserStock: (stockId: string) => Promise<void>;
    removeUserStock: (stockId: string) => Promise<void>;
}

const useUserStockStore = create<UserStockStore>((set, get) => ({
    userStocks: [],

    updateUserStocks: async () => {
        try {
            const response = await axiosInstance.get<{ stocks: Stock[] } | Stock[]>(`/user/stocks`);
            const stocksData = Array.isArray(response.data) ? response.data : response.data.stocks;
            set({ userStocks: stocksData });
        } catch (error) {
            console.error("Error fetching user stocks:", error);
        }
    },

    addUserStock: async (stockId: string) => {
        try {
            await axiosInstance.get(`/user/stocks/add/${stockId}`);
            console.log(`Stock ${stockId} processed for user stocks on the backend.`);
            await get().updateUserStocks();
        } catch (error) {
            console.error(`Error processing stock ${stockId} for user:`, error);
        }
    },
    removeUserStock: async (stockId: string) => {
        try {
            await axiosInstance.get(`/user/stocks/remove/${stockId}`);
            console.log(`Stock ${stockId} removed from user stocks on the backend.`);
            await get().updateUserStocks();
        } catch (error) {
            console.error(`Error removing stock ${stockId} for user:`, error);
        }
    }
}));

export default useUserStockStore;