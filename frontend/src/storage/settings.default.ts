
import interfaceDefault from './default/interface'
import chartDefault from './default/chats'
import notificationsSettings from "@/storage/default/notifications";
import {Settings} from "@/storage/storage.types";

export const DEFAULT_SETTINGS: Settings = {
    interface: interfaceDefault,
    chart: chartDefault,
    notifications: notificationsSettings,
}