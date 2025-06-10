/**
 * =================================================================
 * SERVICE WORKER for PUSH NOTIFICATIONS (Updated)
 * =================================================================
 * This service worker is designed to handle push data from a backend
 * sending a payload that matches the following Java class schema:
 *
 * public class Message {
 * private String title;       // -> Notification Title
 * private String description; // -> Notification Body
 * private String stock;       // -> Used to build the click URL (e.g., /stocks/AAPL)
 * }
 * =================================================================
 */

// --- 1. Event listener for PUSH events ---
self.addEventListener('push', function (event) {
    let pushData;

    // --- A. Check if the push event has data ---
    if (event.data) {
        try {
            // Parse the JSON data from the server
            pushData = event.data.json();
        } catch (e) {
            console.error('Failed to parse push data as JSON:', e);
            // If parsing fails, use a default fallback structure
            pushData = {
                title: 'New Update',
                description: 'Something new has happened!',
                stock: null
            };
        }
    } else {
        // --- B. Use default data if the push has no payload ---
        pushData = {
            title: 'New Update',
            description: 'Something new has happened!',
            stock: null
        };
    }

    // --- C. Prepare the notification options based on the new schema ---
    const options = {
        // MODIFIED: Use `pushData.description` for the body
        body: pushData.description,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        data: {
            // MODIFIED: Construct the URL to open on click using the 'stock' property.
            // For example, if `stock` is "AAPL", the URL will be "/stocks/AAPL".
            // If `stock` is null or missing, it defaults to the root URL '/'.
            url: pushData.stock ? `/stocks/${pushData.stock}` : '/'
        }
    };

    // --- D. Show the notification ---
    // The `title` from the push data is used directly here.
    const notificationPromise = self.registration.showNotification(pushData.title, options);
    event.waitUntil(notificationPromise);
});


// --- 2. Event listener for NOTIFICATION CLICK events ---
// NO CHANGES NEEDED HERE.
// This handler already reads the `url` from the notification's `data` object,
// which we correctly constructed in the 'push' event listener.
self.addEventListener('notificationclick', function (event) {
    // Close the notification
    event.notification.close();

    // Logic to open the correct window/tab on click
    const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then((windowClients) => {
        // Get the URL we stored in the data payload
        const urlToOpen = event.notification.data.url;

        // Check if a window with the same URL is already open
        for (const client of windowClients) {
            if (client.url === urlToOpen && 'focus' in client) {
                return client.focus();
            }
        }

        // If not, open a new window
        if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
        }
    });

    event.waitUntil(promiseChain);
});