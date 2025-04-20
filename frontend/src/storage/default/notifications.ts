
import {SettingDetail} from "@/storage/storage.types";

const NOTIFICATIONS = 'notifications'

const EVENTS_SEVERITY = "severity";

enum NOTIFICATION_STATUS_VALUES {
    ON = "on",
    OFF = "off",
}

enum EVENTS_SEVERITY_VALUES {
    CRITICAL = "critical",
    IMPORTANT = "important",
    INFO = "info",
}

export interface NotificationSettings {
    [NOTIFICATIONS]: {
        [NOTIFICATIONS]: SettingDetail<NOTIFICATION_STATUS_VALUES>;
        [EVENTS_SEVERITY]: SettingDetail<EVENTS_SEVERITY_VALUES>;
    }
}

const notificationsSettings: NotificationSettings = {
    [NOTIFICATIONS]: {
            [NOTIFICATIONS]: {
                value: NOTIFICATION_STATUS_VALUES.OFF,
                possibleValues: [NOTIFICATION_STATUS_VALUES.ON, NOTIFICATION_STATUS_VALUES.OFF],
            },
            [EVENTS_SEVERITY]: {
                value: EVENTS_SEVERITY_VALUES.CRITICAL,
                possibleValues: [EVENTS_SEVERITY_VALUES.CRITICAL, EVENTS_SEVERITY_VALUES.IMPORTANT, EVENTS_SEVERITY_VALUES.INFO],
            },
        },
};

export default notificationsSettings;