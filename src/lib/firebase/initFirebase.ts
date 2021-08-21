// Using Analytics will brake the whole website when blocked.
// ^Crashes the startup thread

import { firebaseConfig } from "./env";

let notificationToken;

interface NotificationCallback {
    (message: string): void
}

export async function getMessagingToken() {
    const firebase = (await import('firebase/app')).default;
    await import('firebase/analytics')
    await import('firebase/messaging')

    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
    const registration = await navigator.serviceWorker.ready;
    messaging.getToken({ serviceWorkerRegistration: registration, vapidKey: 'BFRORkK2I9sWzemLZwT8N4UZVFkql0GT4_1Jz9Oo0rSXMhZQLEjVWFFwQVhb_t2go1uGyG9nrQmtrMnc6kRXnNE' }).then((currentToken) => {
        if (currentToken) {
            console.log("Token Retrieval SUCESSSSSS");
            fetch(`https://govhack2021-backend.host.qrl.nz/push-notification/${currentToken}`, {
                method: 'POST',
            });
            notificationToken = currentToken
        } else {
            // Show permission request UI
            console.log('No registration token available. Requesting permission to generate one.');

            // ...
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
    });
}
export function deregisterForPushNotifications() {
    if (typeof notificationToken !== "undefined") {
        fetch(`https://govhack2021-backend.host.qrl.nz/push-notification/${notificationToken}`, {
                method: 'DELETE',
            });
    } else {
        console.log("Trying to turn off notifications but was never on in the first place")
    }
}

export async function initFirebase(notificationCallback: NotificationCallback) {
    if (typeof window !== "undefined") {
        const firebase = (await import('firebase/app')).default;
        await import('firebase/analytics')
        await import('firebase/messaging')

        firebase.initializeApp(firebaseConfig);
        const messaging = firebase.messaging();
        await getMessagingToken();




        messaging.onMessage((payload) => {
            console.log('Message received. ', payload);
            notificationCallback("GOT NOTIFICATION" + payload)
            // ...
        });


        const analytics = firebase.analytics();
        analytics.logEvent('Startup');
        return;
    }
}

// Notification.requestPermission(function (status) {
//     console.log('Notification permission status:', status);
// });