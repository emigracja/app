"use client";
import { ReactElement, useEffect, useState } from "react";
import Image from "next/image";
import { getTimeDifference } from "@/utils/util";

import Tag from "@/components/news/Tag";
import { MoonLoader } from "react-spinners";

interface Props {
  externalId: string | null;
  title: string;
  publishedAt: string;
  affectedStocks: number | null;
  stocks: { symbol: string; impact: string }[];
  author: string;
  imageUri: string;
  slug: string;
  backgroundImage: string;
}

const Card = ({
  title,
  publishedAt,
  affectedStocks,
  author,
  stocks,
  slug,
  backgroundImage,
}: Props): ReactElement => {
  const publishedAtString = getTimeDifference(publishedAt);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!backgroundImage) {
      setIsLoading(false);
    }
  }, [backgroundImage]);

  return (
    <section className="min-h-32 relative block text-xl text-white rounded-xl p-3 box-content">
      <a href={`/news/${slug}`} className="flex flex-col gap-5 justify-end">
        <p className={"text-white font-bold"}>{title}</p>
        <div className={"flex justify-between content-center overflow-hidden"}>
          <div className={"flex gap-2"}>
            {stocks.map((tag) => (
              <Tag key={tag.symbol}>{tag.symbol}</Tag>
            ))}
          </div>
          {affectedStocks && (
            <p className={"text-white font-bold text-sm h-0 mt-3"}>
              Affected Stocks ({affectedStocks})
            </p>
          )}
        </div>
      </a>
      <div className="flex absolute inset-0 rounded-xl pointer-events-none">
        {isLoading ? <MoonLoader className="m-auto" color="white" /> : null}
        {backgroundImage ? (
          <Image
            onLoad={() => {
              setIsLoading(false);
            }}
            className=" opacity-40 pointer-events-none"
            quality={50}
            src={backgroundImage}
            alt="background"
            layout="fill"
          />
        ) : (
          <div className="w-full h-full bg-gray-600 opacity-30"></div>
        )}
      </div>
      <div
        className={"absolute text-white -bottom-6 right-0 opacity-70 text-sm"}
      >
        {author} {"•"} {publishedAtString}
      </div>
    </section>
  );
};

export default Card;
