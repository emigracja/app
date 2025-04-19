import { ReactElement } from "react";
import { User } from "@/types/users";
import UserCard from "./UserCard";

interface Props {
  users: User[];
}
// TODO: Add lazy loading
const UserList = ({ users }: Props): ReactElement => {
  return (
    <div className="flex flex-col gap-6 px-2">
      {users.map((element) => (
        <UserCard key={element.id} {...element} />
      ))}
    </div>
  );
};

export default UserList;
