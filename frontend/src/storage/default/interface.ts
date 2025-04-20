import {Setting, SettingDetail} from "@/storage/storage.types";

const INTERFACE = "interface";
const MODE = 'mode'
const LANGUAGE = 'language'

enum MODE_VALUES {
    DARK = 'dark',
    LIGHT = 'light',
}

enum LANGUAGE_VALUES {
    EN = 'en',
    PL = 'pl'
}

export interface InterfaceSettings {
    [INTERFACE]: {
        [MODE]: SettingDetail<MODE_VALUES>;
        [LANGUAGE]: SettingDetail<LANGUAGE_VALUES>;
    }
}

const defaultSettings: InterfaceSettings = {
    [INTERFACE]: {
        [MODE]: {
            value: MODE_VALUES.DARK,
            possibleValues: [MODE_VALUES.DARK, MODE_VALUES.LIGHT],
        },
        [LANGUAGE]: {
            value: LANGUAGE_VALUES.EN,
            possibleValues: [LANGUAGE_VALUES.PL, LANGUAGE_VALUES.EN],
        },
    }
};

export default defaultSettings;