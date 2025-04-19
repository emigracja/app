"use client";

import UserList from "@/components/admin/UserList";
import useDataStore from "@/store/useDataStore";
import { useEffect, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { debounce } from "lodash";

export default function NewsPage() {
  const users = useDataStore((store) => store.users);
  const [filteredUsers, setFilteredUsers] = useState(users);

  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get("search");

    if (!searchQuery) {
      setFilteredUsers(users);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    searchQuery
      ? setFilteredUsers(
          users.filter((user) => user.email.includes(searchQuery.toLowerCase()))
        )
      : setFilteredUsers(users);
  }, [searchParams, users]);

  const search = useCallback(
    debounce((query: string) => {
      const url = new URL(window.location.href);
      url.searchParams.set("search", query);
      window.history.pushState({}, "", url);
    }, 50),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    search(e.target.value);
  };

  return (
    <>
      <div className="w-full p-2">
        <input
          value={searchParams.get("search") ?? ""}
          onChange={handleChange}
          className="p-2 w-full text-white border-white border-1 rounded-xl outline-none"
          type="text"
          placeholder="Search..."
        />
      </div>
      <UserList users={filteredUsers} />;
    </>
  );
}
