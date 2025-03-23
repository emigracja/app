import { Setting } from "@/types/appSettings";
import { ReactElement } from "react";

interface Props {
  name: string;
  settings: Setting[];
}

const SettingGroup = ({ name, settings }: Props): ReactElement => {
  return (
    <div className="mx-4 my-3 p-2 font-bold">
      <p className="text-xl uppercase">{name}</p>
      <div className="bg-gray-400 w-full h-[2px]"></div>
      {settings.map((setting) => (
        <div className="flex justify-between" key={setting.name}>
          <p className="text-xl ml-3">{setting.name}</p>
          <p className="text-xl">{setting.value}</p>
        </div>
      ))}
    </div>
  );
};

export default SettingGroup;
