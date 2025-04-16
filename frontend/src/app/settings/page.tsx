import useUserStore from "@/store/useUserStore";
import { AppSettings, SettingsGroupInt } from "@/types/appSettings";
import SettingsGroup from "@/components/settings/SettingsGroup";
import { SignOutButton } from "@/components/auth/authButtons";

const SettingsPage = () => {
  const { settings } = useUserStore.getState();

  const settingsArray = new Array<SettingsGroupInt>();

  let key: keyof AppSettings;
  for (key in settings) {
    settingsArray.push(settings[key]);
  }

  return (
    <div className="text-white w-full h-full overflow-auto flex flex-col justify-between">
      <div>
        {settingsArray.map((group) => {
          return <SettingsGroup {...group} key={group.name} />;
        })}
      </div>
      <SignOutButton />
    </div>
  );
};

export default SettingsPage;
