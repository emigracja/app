'use client'
import React, { ReactElement, useState, useEffect } from "react";
import { SettingDetail } from "@/storage/storage.types";
import { setUserSettings } from "@/storage/settings.storage";

export interface SettingGroupProps {
    name: string;
    settings: {
        [sectionName: string]: {
            [settingName: string]: SettingDetail<any>;
        }
    };
}

const capitalizeFirstLetter = (inputString: string)  => {
    if (!inputString) {
        return "";
    }

    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}


const SettingGroup = ({ name, settings }: SettingGroupProps): ReactElement | null => {
    const sectionName = Object.keys(settings)[0];
    const initialValues = settings[sectionName];

    const [currentSectionSettings, setCurrentSectionSettings] = useState(initialValues);

    useEffect(() => {
        const updatedValues = settings[sectionName];
        if (updatedValues) {
            setCurrentSectionSettings(updatedValues);
        }
    }, [JSON.stringify(settings[sectionName]), sectionName]);


    const handleSettingChange = (settingName: string, newValue: string | number | boolean) => {
        const updatedSettings = {
            ...currentSectionSettings,
            [settingName]: {
                ...currentSectionSettings[settingName],
                value: newValue
            }
        };

        setCurrentSectionSettings(updatedSettings);

        setUserSettings({ [name]: { [sectionName]: updatedSettings } });
    };


    return (
        <div>
            <h2 className="text-xl font-bold text-white border-2 border-gray-600">
                {name.toUpperCase()}
            </h2>

            <div className="flex gap-3 text-md flex-col align-center capitalize p-10 mt-2 mb-2">
                {Object.entries(currentSectionSettings).map(([settingName, settingData]) => {
                    if (!settingData) return null;

                    const possibleValues = (Array.isArray(settingData.possibleValues))
                        ? settingData.possibleValues.map(String)
                        : [];

                    const currentValue = String(settingData.value);

                    return (
                        <div className="p-2 flex font-bold capitalize items-center justify-between border-b border-gray-600" key={settingName}>
                            <label
                                htmlFor={`setting-${sectionName}-${settingName}`}
                            >
                                {capitalizeFirstLetter(settingName)}
                            </label>

                            <div>
                                <select
                                    id={`setting-${sectionName}-${settingName}`}
                                    onChange={(e) => {
                                        handleSettingChange(settingName, e.target.value);
                                    }}
                                    value={currentValue}
                                    className="block bg-transparent capitalize border border-gray-600 rounded-md px-3 py-2 text-center appearance-none focus:outline-none focus:border-gray-400 pr-6"
                                    style={{ WebkitAppearance: 'none', MozAppearance: 'none', textAlignLast: 'center' }}
                                >
                                    {possibleValues.map((possibleValue, index) => (
                                        <option
                                            key={index}
                                            value={possibleValue}
                                            className="bg-gray-900 text-center "
                                            style={{ textAlign: 'center' }}
                                        >
                                            {capitalizeFirstLetter(possibleValue)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SettingGroup;