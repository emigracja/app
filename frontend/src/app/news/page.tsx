import {News} from "../../types/news";
import Card from "@/components/news/Card";

export default function NewsPage() {

    const news: News[] = [
        {
            id: "1",
            title: "China and Canada Retaliate Against Trump Tariffs, With Mexico to Counter on Sunday: Live Updates",
            publishedAt: "1741209855234",
            affectedStocks: 2,
            author: "New York Times",
            tags: ["TAG1", "TAG2"],
            imageUri: "/images/image.png"
        }
    ]

    return (
        <div className="flex flex-col gap-10 p-2" style={{
            backgroundColor: "transparent"
        }}>
            {news.map((element) => (
                <Card key={element.id} {...element} />
            ))}
        </div>
    );
}