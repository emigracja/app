import {ReactElement} from "react";
import Tag from "@/components/news/Tag";
import Image from "next/image";

interface Props {
    id: string;
    title: string;
    publishedAt: string;
    affectedStocks: number;
    tags: string[];
    author: string;
    imageUri: string;
}

const getTimeDifference = (publishedAt: string): string => {
    const now = Date.now();
    const published = parseInt(publishedAt) * 1000;
    const diff = now - published;

    const timeUnits = [
        { unit: "year", value: 1000 * 60 * 60 * 24 * 365 },
        { unit: "month", value: 1000 * 60 * 60 * 24 * 30 },
        { unit: "week", value: 1000 * 60 * 60 * 24 * 7 },
        { unit: "day", value: 1000 * 60 * 60 * 24 },
        { unit: "hour", value: 1000 * 60 * 60 },
        { unit: "minute", value: 1000 * 60 }
    ];

    let publishedAtString = "just now";

    for (const { unit, value } of timeUnits) {
        const diffInUnit = Math.floor(diff / value);
        if (diffInUnit > 0) {
            publishedAtString = `${diffInUnit} ${unit}${diffInUnit > 1 ? "s" : ""} ago`;
            break;
        }
    }

    return publishedAtString;
}

const Card = ({
                  id, title, publishedAt, affectedStocks, tags, author, imageUri
              }: Props): ReactElement => {

    const publishedAtString = getTimeDifference(publishedAt);

    return (
        <a className="relative block text-xl text-white rounded-xl p-3 box-content" href={`/news/${id}`}>
            <section className="flex flex-col gap-5 justify-end">
                <p className={"text-white font-bold"}>
                    {title}
                </p>
                <div className={"flex justify-between content-center"}>
                    <div className={"flex gap-2"}>
                        {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                    </div>
                    <p className={"text-white font-bold text-sm h-0 mt-3"}>
                        Affected Stocks ({affectedStocks})
                    </p>
                </div>
            </section>
            <Image
                className="absolute inset-0 object-cover box-content opacity-60 rounded-xl"
                src={imageUri}
                alt="background"
                layout="fill"
            />
            <div className={"absolute text-white -bottom-6 right-0 opacity-50 text-sm"}>
                {publishedAtString} {"•"} {author}
            </div>
        </a>
    )
}

export default Card;