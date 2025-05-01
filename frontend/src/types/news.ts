export interface News {
  externalId: string;
  title: string;
  publishedAt: string;
  affectedStocks: number;
  stocks: string[];
  author: string;
  imageUri: string;
  slug: string;
}
