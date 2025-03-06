import {News} from "../../types/news";
import Card from "@/components/news/Card";
const news: News[] = [
    {
        id: "1",
        title: "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
        publishedAt: "1741209855234",
        affectedStocks: 2,
        author: "New York Times",
        tags: ["TAG1", "TAG2"],
        imageUri: "/images/image.png"
    },
    {
        id: "2",
        title: "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
        publishedAt: "1741209855234",
        affectedStocks: 2,
        author: "New York Times",
        tags: ["TAG1", "TAG2"],
        imageUri: "/images/image.png"
    },
    {
        id: "3",
        title: "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
        publishedAt: "1741209855234",
        affectedStocks: 2,
        author: "New York Times",
        tags: ["TAG1", "TAG2"],
        imageUri: "/images/image.png"
    },
    {
        id: "4",
        title: "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
        publishedAt: "1741209855234",
        affectedStocks: 2,
        author: "New York Times",
        tags: ["TAG1", "TAG2"],
        imageUri: "/images/image.png"
    },
    {
        id: "5",
        title: "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
        publishedAt: "1741209855234",
        affectedStocks: 2,
        author: "New York Times",
        tags: ["TAG1", "TAG2"],
        imageUri: "/images/image.png"
    },
    {
        id: "6",
        title: "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
        publishedAt: "1741209855234",
        affectedStocks: 2,
        author: "New York Times",
        tags: ["TAG1", "TAG2"],
        imageUri: "/images/image.png"
    },
    {
        id: "7",
        title: "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
        publishedAt: "1741209855234",
        affectedStocks: 2,
        author: "New York Times",
        tags: ["TAG1", "TAG2"],
        imageUri: "/images/image.png"
    },
    {
        id: "8",
        title: "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
        publishedAt: "1741209855234",
        affectedStocks: 2,
        author: "New York Times",
        tags: ["TAG1", "TAG2"],
        imageUri: "/images/image.png"
    },
    {
        id: "9",
        title: "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
        publishedAt: "1741209855234",
        affectedStocks: 2,
        author: "New York Times",
        tags: ["TAG1", "TAG2"],
        imageUri: "/images/image.png"
    },
    {
        id: "10",
        title: "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
        publishedAt: "1741209855234",
        affectedStocks: 2,
        author: "New York Times",
        tags: ["TAG1", "TAG2"],
        imageUri: "/images/image.png"
    },
    {
        id: "11",
        title: "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
        publishedAt: "1741209855234",
        affectedStocks: 2,
        author: "New York Times",
        tags: ["TAG1", "TAG2"],
        imageUri: "/images/image.png"
    },

]

export default function NewsPage() {
    return (
        <div className="flex flex-col gap-10 p-2 h-full overflow-scroll" style={{
            backgroundColor: "transparent"
        }}>
            {news.map((element) => (
                <Card key={element.id} {...element} />
            ))}
        </div>
    );
}