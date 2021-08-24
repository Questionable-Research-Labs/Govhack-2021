// Using Analytics will brake the whole website when blocked.
// ^Crashes the startup thread

import { firebaseConfig } from "./env";
import {notificationTokenRegistered, notificationsEnabled} from "$lib/store"

let notificationToken;

interface NotificationCallback {
    (message: string): void
}

export async function getMessagingToken() {
    
    const firebase = (await import('firebase/app')).default;
    await import('firebase/analytics')
    await import('firebase/messaging')
    const messaging = firebase.messaging();
    console.log("Waiting for service worker")
    const registration = await navigator.serviceWorker.ready;
    console.log("getting Token")
    messaging.getToken({ serviceWorkerRegistration: registration, vapidKey: 'BFRORkK2I9sWzemLZwT8N4UZVFkql0GT4_1Jz9Oo0rSXMhZQLEjVWFFwQVhb_t2go1uGyG9nrQmtrMnc6kRXnNE' }).then((currentToken) => {
        if (currentToken) {
            fetch(`https://govhack2021-backend.host.qrl.nz/push-notification/${currentToken}`, {
                method: 'POST',
            });
            notificationTokenRegistered.set(true)

            console.log("Token Retrieval SUCESSSSSS");

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
    console.log("Deregister for notifications")
    fetch(`https://govhack2021-backend.host.qrl.nz/push-notification/${notificationToken}`, {method: 'DELETE'});
    notificationTokenRegistered.set(false);
}

export async function initFirebase(notificationCallback: NotificationCallback) {
    if (typeof window !== "undefined") {
        const firebase = (await import('firebase/app')).default;
        await import('firebase/analytics')
        await import('firebase/messaging')
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }
        const messaging = firebase.messaging();

        if (notificationsEnabled) {
            await getMessagingToken();
        }



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