import { News } from "@/types/news";
import { Stock, CandlestickData } from "@/types/stocks";
import { AppSettings } from "@/types/appSettings";

export const defaultSettings: AppSettings = {
  interface: {
    name: "Interface",
    settings: [
      {
        name: "Mode",
        value: "Dark",
        possibleValues: ["Dark", "Light"],
      },
      {
        name: "Language",
        value: "EN",
        possibleValues: ["EN", "PL"],
      },
    ],
  },
  notifications: {
    name: "Notifications",
    settings: [
      {
        name: "Notifications",
        value: "Off",
        possibleValues: ["On", "Off"],
      },
      {
        name: "Events Severity",
        value: "Critical",
        possibleValues: ["Critical", "Important", "Info"],
      },
    ],
  },
  charts: {
    name: "Charts",
    settings: [
      {
        name: "Default Candle Period",
        value: "1h",
        possibleValues: ["1w", "1d", "4h", "1h", "15m", "1m"],
      },
    ],
  },
};

const AppleCandles: CandlestickData[] = [
  { time: "2018-12-22", open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
  { time: "2018-12-23", open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
  { time: "2018-12-24", open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
  { time: "2018-12-25", open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
  { time: "2018-12-26", open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
  { time: "2018-12-27", open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
  {
    time: "2018-12-28",
    open: 111.51,
    high: 142.83,
    low: 103.34,
    close: 131.25,
  },
  {
    time: "2018-12-29",
    open: 131.33,
    high: 151.17,
    low: 77.68,
    close: 96.43,
  },
  { time: "2018-12-30", open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
  {
    time: "2018-12-31",
    open: 109.87,
    high: 114.69,
    low: 85.66,
    close: 111.26,
  },
];

const TeslaCandles: CandlestickData[] = [
  { time: "2024-03-01", open: 195.5, high: 210.3, low: 190.2, close: 205.8 },
  { time: "2024-03-02", open: 206.1, high: 215.7, low: 203.4, close: 211.5 },
  { time: "2024-03-03", open: 212.0, high: 220.9, low: 208.7, close: 218.3 },
  { time: "2024-03-04", open: 218.5, high: 225.0, low: 215.1, close: 223.4 },
  { time: "2024-03-05", open: 224.0, high: 230.8, low: 219.6, close: 228.2 },
  { time: "2024-03-06", open: 229.1, high: 235.3, low: 225.4, close: 232.9 },
  { time: "2024-03-07", open: 233.5, high: 240.1, low: 230.7, close: 238.6 },
  { time: "2024-03-08", open: 239.0, high: 245.5, low: 235.2, close: 242.3 },
  { time: "2024-03-09", open: 243.0, high: 250.4, low: 240.1, close: 248.7 },
  { time: "2024-03-10", open: 249.2, high: 255.9, low: 245.6, close: 253.5 },
];

const AmazonCandles: CandlestickData[] = [
  { time: "2024-03-01", open: 145.2, high: 152.8, low: 140.5, close: 150.3 },
  { time: "2024-03-02", open: 151.0, high: 158.6, low: 148.2, close: 155.7 },
  { time: "2024-03-03", open: 156.0, high: 162.4, low: 153.8, close: 159.9 },
  { time: "2024-03-04", open: 160.3, high: 168.2, low: 158.1, close: 165.4 },
  { time: "2024-03-05", open: 166.0, high: 172.5, low: 162.8, close: 170.2 },
  { time: "2024-03-06", open: 171.1, high: 175.8, low: 167.4, close: 174.3 },
  { time: "2024-03-07", open: 175.0, high: 180.2, low: 172.6, close: 178.9 },
  { time: "2024-03-08", open: 179.0, high: 185.6, low: 176.8, close: 183.4 },
  { time: "2024-03-09", open: 184.0, high: 190.4, low: 181.2, close: 188.7 },
  { time: "2024-03-10", open: 189.0, high: 195.9, low: 186.6, close: 192.5 },
];

const candlesXYZ: CandlestickData[] = [
  { time: "2024-03-01", open: 90.0, high: 100.5, low: 85.2, close: 95.8 },
  { time: "2024-03-02", open: 96.0, high: 105.2, low: 92.5, close: 102.3 },
  { time: "2024-03-03", open: 103.0, high: 110.8, low: 99.5, close: 108.7 },
  { time: "2024-03-04", open: 109.0, high: 118.5, low: 106.3, close: 115.2 },
  { time: "2024-03-05", open: 116.0, high: 125.3, low: 113.7, close: 121.9 },
  { time: "2024-03-06", open: 122.5, high: 128.7, low: 119.8, close: 125.4 },
  { time: "2024-03-07", open: 126.0, high: 130.5, low: 122.1, close: 127.3 },
  { time: "2024-03-08", open: 127.0, high: 128.4, low: 120.5, close: 123.2 },
  { time: "2024-03-09", open: 122.0, high: 125.2, low: 110.5, close: 112.8 },
  { time: "2024-03-10", open: 113.0, high: 115.0, low: 88.7, close: 89.5 },
];

export const stocks: Stock[] = [
  {
    id: "abc",
    title: "APPLE CORP",
    shortcut: "AAPL.US",
    currency: "USD",
    market: "USA",
    price: 111.26,
    todaysPriceChange: -1.1,
    currentPeriod: "1w",
    tags: ["tech", "mobile"],
    periodPrices: AppleCandles,
  },
  {
    id: "abcd",
    title: "APPLE CORP",
    shortcut: "AAPL.US",
    currency: "USD",
    market: "USA",
    price: 111.26,
    todaysPriceChange: -1.1,
    currentPeriod: "1w",
    tags: ["tech", "mobile"],
    periodPrices: AppleCandles,
  },
  {
    id: "xyz",
    title: "TESLA INC",
    shortcut: "TSLA.US",
    currency: "USD",
    market: "USA",
    price: 253.5,
    todaysPriceChange: +4.8,
    currentPeriod: "1w",
    tags: ["auto", "tech"],
    periodPrices: TeslaCandles,
  },
  {
    id: "abg",
    title: "AMAZON.COM INC",
    shortcut: "AMZN.US",
    currency: "USD",
    market: "USA",
    price: 192.5,
    todaysPriceChange: +3.6,
    currentPeriod: "1w",
    tags: ["e-commerce", "cloud"],
    periodPrices: AmazonCandles,
  },
  {
    id: "def",
    title: "XYZ CORP",
    shortcut: "XYZ.US",
    currency: "USD",
    market: "USA",
    price: 89.5,
    todaysPriceChange: -3.5,
    currentPeriod: "1w",
    tags: ["finance", "banking"],
    periodPrices: candlesXYZ,
  },
];

export const news: News[] = [
  {
    id: "1",
    title:
      "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
    publishedAt: "1741209855234",
    affectedStocks: 2,
    author: "New York Times",
    tags: ["TAG1", "TAG2"],
    imageUri: "/images/image.png",
  },
  {
    id: "2",
    title:
      "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
    publishedAt: "1741209855234",
    affectedStocks: 2,
    author: "New York Times",
    tags: ["TAG1", "TAG2"],
    imageUri: "/images/image.png",
  },
  {
    id: "3",
    title:
      "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
    publishedAt: "1741209855234",
    affectedStocks: 2,
    author: "New York Times",
    tags: ["TAG1", "TAG2"],
    imageUri: "/images/image.png",
  },
  {
    id: "4",
    title:
      "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
    publishedAt: "1741209855234",
    affectedStocks: 2,
    author: "New York Times",
    tags: ["TAG1", "TAG2"],
    imageUri: "/images/image.png",
  },
  {
    id: "5",
    title:
      "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
    publishedAt: "1741209855234",
    affectedStocks: 2,
    author: "New York Times",
    tags: ["TAG1", "TAG2"],
    imageUri: "/images/image.png",
  },
  {
    id: "6",
    title:
      "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
    publishedAt: "1741209855234",
    affectedStocks: 2,
    author: "New York Times",
    tags: ["TAG1", "TAG2"],
    imageUri: "/images/image.png",
  },
  {
    id: "7",
    title:
      "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
    publishedAt: "1741209855234",
    affectedStocks: 2,
    author: "New York Times",
    tags: ["TAG1", "TAG2"],
    imageUri: "/images/image.png",
  },
  {
    id: "8",
    title:
      "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
    publishedAt: "1741209855234",
    affectedStocks: 2,
    author: "New York Times",
    tags: ["TAG1", "TAG2"],
    imageUri: "/images/image.png",
  },
  {
    id: "9",
    title:
      "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
    publishedAt: "1741209855234",
    affectedStocks: 2,
    author: "New York Times",
    tags: ["TAG1", "TAG2"],
    imageUri: "/images/image.png",
  },
  {
    id: "10",
    title:
      "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
    publishedAt: "1741209855234",
    affectedStocks: 2,
    author: "New York Times",
    tags: ["TAG1", "TAG2"],
    imageUri: "/images/image.png",
  },
  {
    id: "11",
    title:
      "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
    publishedAt: "1741209855234",
    affectedStocks: 2,
    author: "New York Times",
    tags: ["TAG1", "TAG2"],
    imageUri: "/images/image.png",
  },
];
