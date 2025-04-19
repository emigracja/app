import { ReactElement } from "react";
import Image from "next/image";
import favEmpty from "../../../public/icons/favEmpty.svg";
import notification from "../../../public/icons/notfication.svg";

interface Props {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role: string;
}

const handleGrantPermissions = () => {
  console.log("You're admin now!");
};

const handleBlock = () => {
  console.log("and now you're blocked!");
};

const UserCard = ({
  id,
  email,
  firstName,
  lastName,
  phoneNumber,
}: Props): ReactElement => {
  return (
    <section className="relative block text-xl text-white rounded-xl p-3 box-content bg-card-bg flex flex-col">
      <a href={id != null ? `/users/${id}` : ""}>
        <p className={"text-white font-bold"}>{email}</p>
      </a>
      <div className="flex justify-between items-end w-full">
        <div className="flex flex-col max-w-[60%]">
          <p className="pt-2">
            {firstName} {lastName}
          </p>
          <p className="pt-2">{phoneNumber}</p>
        </div>
        <div className="flex flex-end">
          <button onClick={handleBlock}>
            <Image
              className="box-border mr-2 rounded-xl active:bg-white/5"
              src={notification}
              alt="favEmpty"
              height={40}
              width={40}
            />
          </button>
          <button onClick={handleGrantPermissions}>
            <Image
              className="box-border rounded-xl active:bg-white/5"
              src={favEmpty}
              alt="favEmpty"
              height={40}
              width={40}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserCard;
