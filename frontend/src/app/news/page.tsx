"use client";

import NewsList from "@/components/news/NewsList";
import { useQuery } from "@tanstack/react-query";
import axios from "@/utils/axios";


const fetchNews = async () => {
  const response = await axios.get(`/articles?size=20`);
  return response.data;
};

export default function NewsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
  });

  if(isLoading) {
    return <div>Loading...</div>;
  }

  console.log(data)

  return <NewsList news={data} />;
}
