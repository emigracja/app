import {DEFAULT_SETTINGS} from "@/storage/settings.default";
import {Settings} from "@/storage/storage.types";

const settingsKey = 'settings'

export const getUserSettings = (): Settings => {
    const settings = localStorage.getItem(settingsKey);
    return  settings ? JSON.parse(settings) : DEFAULT_SETTINGS;
}

const isObject = (item: any): item is Record<string, any> => {
    return (item && typeof item === 'object' && !Array.isArray(item));
};

export const deepMergeSettings = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
    const output: T = { ...target };

    Object.keys(source).forEach((key) => {
        const sourceKey = key as keyof T;
        const targetValue = output[sourceKey];
        const sourceValue = source[sourceKey];

        if (isObject(targetValue) && isObject(sourceValue)) {
            output[sourceKey] = deepMergeSettings(targetValue as Record<string, any>, sourceValue) as T[keyof T];
        } else {
            output[sourceKey] = sourceValue as T[keyof T];
        }
    });

    return output;
};


export const setUserSettings = (settings: Partial<Settings>) => {
    const currentSettings = getUserSettings();

    const updatedSettings = deepMergeSettings(currentSettings, settings);

    try {
        localStorage.setItem(settingsKey, JSON.stringify(updatedSettings));
    } catch (error) {
        console.error("Error saving settings to localStorage:", error);
    }
};

