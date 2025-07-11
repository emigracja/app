import { NotificationSettings } from "@/storage/default/notifications";

export interface SettingDetail<T> {
  value: T;
  possibleValues: T[];
}

export interface Setting<T> {
  [key: string]: SettingDetail<T>;
}

export interface Settings {
  // interface: InterfaceSettings;
  // chart: ChartSettings,
  notifications: NotificationSettings;
}
