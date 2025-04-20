'use client';
import React, {useEffect} from 'react';

import { getUserSettings } from "@/storage/settings.storage";
import {SettingDetail} from "@/storage/storage.types";
import SettingsGroup from "@/components/settings/SettingsGroup";

const SettingsPage = () => {
    const settings = getUserSettings();

    const settingsArray = Object.entries(settings);

    return (
        <div className="text-white h-full overflow-auto flex flex-col justify-between p-10">
            <div>
                {settingsArray.map(([groupKey, groupValue]) => {

                    const settingsForGroupComponent = groupValue as { [settingName: string]: SettingDetail<any> };

                    const groupComponentProps = {
                        name: groupKey,
                        settings: settingsForGroupComponent,
                    };

                    return (
                        <SettingsGroup {...groupComponentProps} key={groupKey} />
                    );
                })}
            </div>
            {/*<SignOutButton />*/}
        </div>
    );
};

export default SettingsPage;