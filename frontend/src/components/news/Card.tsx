import { ReactElement } from "react";
import Image from "next/image";
import { getRandomInt, getTimeDifference } from "@/utils/util";

import Tag from "@/components/news/Tag";

interface Props {
  externalId: string | null;
  title: string;
  publishedAt: string;
  affectedStocks: number | null;
  stocks: string[];
  author: string;
  imageUri: string;
  slug: string;
}

const Card = ({
  title,
  publishedAt,
  affectedStocks,
  author,
  stocks,
  slug,
}: Props): ReactElement => {
  const publishedAtString = getTimeDifference(publishedAt);

  const randomImageUrl = `/images/image${getRandomInt(1, 3)}.jpg`;

  return (
    <section className="min-h-32 relative block text-xl text-white rounded-xl p-3 box-content">
      <a href={`/news/${slug}`} className="flex flex-col gap-5 justify-end">
        <p className={"text-white font-bold"}>{title}</p>
        <div className={"flex justify-between content-center"}>
          <div className={"flex gap-2"}>
            {stocks.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          {affectedStocks && (
            <p className={"text-white font-bold text-sm h-0 mt-3"}>
              Affected Stocks ({affectedStocks})
            </p>
          )}
        </div>
      </a>
      <Image
        quality={50}
        className="absolute inset-0 object-cover box-content opacity-40 rounded-xl pointer-events-none"
        src={randomImageUrl}
        alt="background"
        layout="fill"
      />
      <div
        className={"absolute text-white -bottom-6 right-0 opacity-70 text-sm"}
      >
        {author} {"•"} {publishedAtString}
      </div>
    </section>
  );
};

export default Card;
