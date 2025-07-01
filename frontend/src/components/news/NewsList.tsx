import { ReactElement } from "react";
import { News } from "@/types/news";
import Card from "./Card";

interface Props {
  news: News[];
}

const NewsList = ({ news }: Props): ReactElement => {
  return (
    <div className="flex flex-col gap-10 px-2">
      {news.map((element) => (
        <Card key={element.externalId} {...element} />
      ))}
    </div>
  );
};

export default NewsList;
