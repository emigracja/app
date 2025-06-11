import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type NotificationSeverity =  'medium' | 'high' | 'severe';

interface SettingsState {
    notificationsEnabled: boolean;
    severity: NotificationSeverity;
    setNotificationsEnabled: (enabled: boolean) => void;
    setSeverity: (severity: NotificationSeverity) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            notificationsEnabled: false,
            severity: 'medium', // Default severity level

            setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
            setSeverity: (severity) => set({ severity }),
        }),
        {
            name: 'notification-settings-storage',
            storage: createJSONStorage(() => localStorage),

            version: 1,
            migrate: (persistedState: any, version: number) => {
                if (version === 0) {
                    switch (persistedState.severity) {
                        case 'critical':
                            persistedState.severity = 'severe';
                            break;
                        case 'important':
                            persistedState.severity = 'high';
                            break;
                        case 'info':
                            persistedState.severity = 'medium';
                            break;
                        default:
                            break;
                    }
                }
                return persistedState as SettingsState;
            },
        }
    )
);