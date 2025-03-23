export interface Setting {
  name: string;
  value: string;
  possibleValues: string[];
}

export interface SettingsGroupInt {
  name: string;
  settings: Setting[];
}

export interface AppSettings {
  interface: SettingsGroupInt;
  notifications: SettingsGroupInt;
  charts: SettingsGroupInt;
}
