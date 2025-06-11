"use client";

import React, { ReactElement, useCallback, useEffect } from "react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { NotificationSeverity, useSettingsStore } from "@/store/useSettingsStore";
import SettingRow from "@/components/settings/SettingsRow";

const SettingGroup = (): ReactElement => {
    const { status, subscribe, unsubscribe, isSupported, updateSeverity } = usePushNotifications();
    const { notificationsEnabled, severity, setNotificationsEnabled, setSeverity } = useSettingsStore();

    useEffect(() => {
        setNotificationsEnabled(status === 'subscribed');
    }, [status, setNotificationsEnabled]);

    const handleNotificationToggle = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const shouldEnable = e.target.value === 'On';

        try {
            if (shouldEnable) {
                await subscribe();
            } else {
                await unsubscribe();
            }
        } catch (error) {
            console.error("Failed to update push notification status:", error);
        }
    }, [subscribe, unsubscribe]);

    const handleSeverityChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSeverity = e.target.value as NotificationSeverity;

        setSeverity(newSeverity);

        await updateSeverity(newSeverity);
    }, [setSeverity, updateSeverity]);

    const isToggleDisabled = !isSupported || status === 'loading' || status === 'denied';

    return (
        <div>
            <h2 className="text-xl font-bold text-white border-b-2 border-gray-600 pb-2">
                NOTIFICATIONS
            </h2>

            <div className="flex flex-col gap-2 p-4 mt-2 mb-2 text-md">
                <SettingRow
                    label="Notifications"
                    value={notificationsEnabled ? 'On' : 'Off'}
                    onChange={handleNotificationToggle}
                    disabled={isToggleDisabled}
                    options={[
                        { value: 'On', label: 'On' },
                        { value: 'Off', label: 'Off' },
                    ]}
                />

                {status === 'denied' && (
                    <p className="text-sm text-red-400 -mt-3 ml-4">
                        Notifications are blocked in your browser settings.
                    </p>
                )}

                {notificationsEnabled && !isToggleDisabled && (
                    <SettingRow
                        label="Severity"
                        value={severity}
                        onChange={handleSeverityChange}
                        options={[
                            { value: 'severe', label: 'Severe' },
                            { value: 'high', label: 'High' },
                            { value: 'medium', label: 'Medium' },
                        ]}
                    />
                )}
            </div>
        </div>
    );
};

export default SettingGroup;