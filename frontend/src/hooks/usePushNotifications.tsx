import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/utils/axios';

const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const getOrCreateDeviceId = (): string => {
    const KEY = 'push_notification_device_id';
    let deviceId = localStorage.getItem(KEY);

    if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem(KEY, deviceId);
    }
    return deviceId;
};

type NotificationSeverity = 'none' | 'low' | 'medium' | 'high' | 'severe';


type PushNotificationStatus =
    | 'loading'
    | 'unsupported'
    | 'needs_home_screen'
    | 'prompt'
    | 'denied'
    | 'subscribed';

export function usePushNotifications() {
    const [status, setStatus] = useState<PushNotificationStatus>('loading');

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = () => 'standalone' in navigator && (navigator as any).standalone;
    const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;

    const activate = useCallback(async () => {
        console.log("Attempting to activate notifications...");
        if (!isSupported) {
            console.log("Push notifications not supported, skipping activation.");
            return;
        }
        try {
            await apiClient.get('/notifications/activate');
            console.log("Successfully activated notifications with the backend.");
        } catch (err) {
            console.error("Failed to activate notifications:", err);
        }
    }, [isSupported]);

    useEffect(() => {
        console.log("usePushNotifications effect started. Determining initial status...");

        const determineInitialStatus = async () => {
            if (!isSupported) {
                console.log("Status check: Browser does not support push notifications.");
                setStatus('unsupported');
                return;
            }

            if (isIOS && !isInStandaloneMode()) {
                console.log("Status check: iOS device not in standalone mode.");
                setStatus('needs_home_screen');
                return;
            }

            console.log("Registering service worker...");
            const registration = await navigator.serviceWorker.register('/worker.js');
            console.log("Service worker registered:", registration);

            const permission = Notification.permission;
            console.log("Current notification permission state:", permission);
            if (permission === 'denied') {
                setStatus('denied');
                return;
            }

            const currentSubscription = await registration.pushManager.getSubscription();
            const isAlreadySubscribed = currentSubscription != null;
            console.log("Checking for existing subscription:", isAlreadySubscribed);

            if (isAlreadySubscribed) {
                console.log("Existing subscription found.");
                setStatus('subscribed');
                await activate();
            } else {
                console.log("No existing subscription found.");
                setStatus('prompt');
            }
        };

        determineInitialStatus();
    }, [isSupported, isIOS, activate]);


    const subscribe = useCallback(async () => {
        console.log("Attempting to subscribe...");
        if (!isSupported) {
            console.log("Cannot subscribe: Push not supported.");
            return;
        }

        setStatus('loading');

        try {
            const registration = await navigator.serviceWorker.ready;

            // --- ✅ KEY CHANGE: Check for existing subscription ---
            // If a subscription already exists, just activate it and exit.
            const existingSubscription = await registration.pushManager.getSubscription();
            if (existingSubscription) {
                console.log("Subscription already exists. Activating it instead of re-subscribing.");
                setStatus('subscribed');
                await activate();
                return;
            }
            // --- End of change ---

            if (Notification.permission !== 'granted') {
                console.log("Requesting notification permission...");
                const permissionResult = await Notification.requestPermission();
                if (permissionResult === 'denied') {
                    console.log("Permission denied by user.");
                    setStatus('denied');
                    return;
                }
            }

            console.log("Fetching VAPID public key from backend...");
            const response = await apiClient.get('/notifications/publicKey');
            const vapidPublicKey = response.data;
            if (!vapidPublicKey || typeof vapidPublicKey !== 'string' || vapidPublicKey.length < 50) {
                console.error("VAPID key from backend is invalid.", vapidPublicKey);
                setStatus('prompt');
                return;
            }
            const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
            console.log("VAPID key received and processed.");

            console.log("Creating new push subscription...");
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey,
            });

            const subscriptionJSON = subscription.toJSON();
            const deviceId = getOrCreateDeviceId();

            console.log("Sending subscription to backend...");
            await apiClient.post('/notifications/subscribe', {
                device_id: deviceId,
                endpoint: subscriptionJSON.endpoint,
                p256dh: subscriptionJSON.keys.p256dh,
                auth: subscriptionJSON.keys.auth,
            });

            console.log("Successfully subscribed.");
            setStatus('subscribed');
        } catch (err) {
            console.error("Failed to subscribe:", err);
            if (Notification.permission === 'denied') {
                setStatus('denied');
            } else {
                setStatus('prompt');
            }
        }
    }, [isSupported, activate]); // Added activate to the dependency array

    const unsubscribe = useCallback(async () => {
        console.log("Attempting to unsubscribe...");
        if (!isSupported) {
            console.log("Cannot unsubscribe: Push not supported.");
            return;
        }

        setStatus('loading');

        try {
            console.log("Sending unsubscribe request to backend...");
            await apiClient.delete(`/notifications/unsubscribe`);
            console.log("Successfully unsubscribed.");
            setStatus('prompt');
        } catch(err) {
            console.error("Failed to unsubscribe:", err);
            setStatus('subscribed');
        }
    }, [isSupported]);

    const requestPermission = useCallback(async () => {
        if ('Notification' in window) {
            console.log("Requesting notification permission via dedicated function...");
            const permission = await Notification.requestPermission();
            console.log("Permission result:", permission);
            if (permission === 'granted' && status === 'prompt') {
                await subscribe();
            } else if (permission === 'denied') {
                setStatus('denied');
            }
        }
    }, [status, subscribe]);

    const updateSeverity = useCallback(async (level: NotificationSeverity) => {
        console.log(`Attempting to update severity level to: ${level}`);
        // We don't strictly need to check for support/subscription here,
        // as the backend should handle updates for known subscriptions.
        try {
            // Using the PUT endpoint you provided
            await apiClient.put(`/notifications/severityLevel/${level}`);
            console.log("Successfully updated severity level on the backend.");
        } catch (err) {
            console.error("Failed to update severity level:", err);
            // Here you could add logic to revert the severity in the UI on failure
        }
    }, []);

    return {
        updateSeverity,
        status,
        subscribe,
        unsubscribe,
        activate,
        requestPermission,
        isSupported,
    };
}