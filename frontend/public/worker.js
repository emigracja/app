/**
 * =================================================================
 * SERVICE WORKER for PUSH NOTIFICATIONS
 * =================================================================
 * This service worker is designed to handle push data from a backend
 * sending a payload that matches the following Java class schema:
 *
 * public class Message {
 * private String title;       // -> Notification Title
 * private String description; // -> Notification Body
 * private String stock;       // -> Stock Symbol (e.g., AAPL, TSLA)
 * private String slug;       // -> Used to build the click URL (e.g., /news/slug)
 * }
 * =================================================================
 */

self.addEventListener('push', function (event) {
    let pushData;

    if (event.data) {
        try {
            pushData = event.data.json();
        } catch (e) {
            console.error('Failed to parse push data as JSON:', e);
            pushData = {
                title: 'New Update',
                description: 'Something new has happened!',
                stock: null,
                slug: null
            };
        }
    } else {
        pushData = {
            title: 'New Update',
            description: 'Something new has happened!',
            stock: null,
            slug: null
        };
    }

    const options = {
        body: pushData.description,
        icon: '/icons/logo.svg',
        badge: '/icons/logo.svg',
        data: {
            url: pushData.slug ? `/news/${pushData.slug}` : '/'
        }
    };

    const notificationPromise = self.registration.showNotification(pushData.title, options);
    event.waitUntil(notificationPromise);
});



self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then((windowClients) => {
        const urlToOpen = event.notification.data.url;

        for (const client of windowClients) {
            if (client.url === urlToOpen && 'focus' in client) {
                return client.focus();
            }
        }
        if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
        }
    });

    event.waitUntil(promiseChain);
});