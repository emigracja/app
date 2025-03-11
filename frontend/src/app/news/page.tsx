"use client";

import NewsList from "@/components/news/NewsList";
import useDataStore from "@/store/useDataStore";

export default function NewsPage() {
  const news = useDataStore((store) => store.news);

  return <NewsList news={news} />;
}
