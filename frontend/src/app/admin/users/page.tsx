"use client";

import UserList from "@/components/admin/UserList";
import useDataStore from "@/store/useDataStore";

export default function NewsPage() {
  const users = useDataStore((store) => store.users);

  return <UserList users={users} />;
}
