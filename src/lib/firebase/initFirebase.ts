// Using Analytics will brake the whole website when blocked.
// ^Crashes the startup thread

import { firebaseConfig } from "./env";


interface NotificationCallback {
    (message: string): void
}

export async function initFirebase(notificationCallback: NotificationCallback ) {
    if (typeof window !== "undefined") {
        const firebase = (await import('firebase/app')).default;
        await import('firebase/analytics')
        await import('firebase/messaging')

        firebase.initializeApp(firebaseConfig);
        const messaging = firebase.messaging();
        const registration = await navigator.serviceWorker.ready;

        messaging.getToken({serviceWorkerRegistration: registration,vapidKey: 'BFRORkK2I9sWzemLZwT8N4UZVFkql0GT4_1Jz9Oo0rSXMhZQLEjVWFFwQVhb_t2go1uGyG9nrQmtrMnc6kRXnNE' }).then((currentToken) => {
            if (currentToken) {
                console.log("Token Retrieval SUCESSSSSS")

              // Send the token to your server and update the UI if necessary
              // ...
            } else {
              // Show permission request UI
              console.log('No registration token available. Request permission to generate one.');
              // ...
            }
          }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            // ...
          });
          

        messaging.onMessage((payload) => {
            console.log('Message received. ', payload);
            notificationCallback("GOT NOTIFICATION"+payload)
            // ...
            });
        

        const analytics = firebase.analytics();
        analytics.logEvent('Startup');
        return;
    }
}