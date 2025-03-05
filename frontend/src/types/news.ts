export interface News {
    id: string;
    title: string;
    publishedAt: string;
    affectedStocks: number;
    tags: string[];
    author: string;
    imageUri: string,
}