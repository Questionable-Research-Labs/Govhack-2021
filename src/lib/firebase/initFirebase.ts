import firebase from "firebase/app/dist/index.cjs.js";
// Using Analytics will brake the whole website when blocked.
// ^Crashes the startup thread
import "firebase/analytics/dist/index.cjs.js";
import "firebase/messaging/dist/index.cjs.js"

import { firebaseConfig } from "./env";

export async function initFirebase() {
    if (typeof window !== "undefined") {

        firebase.initializeApp(firebaseConfig);
        const messaging = firebase.messaging();
        messaging.getToken({serviceWorkerRegistration: "service-worker.js", vapidKey: 'BFRORkK2I9sWzemLZwT8N4UZVFkql0GT4_1Jz9Oo0rSXMhZQLEjVWFFwQVhb_t2go1uGyG9nrQmtrMnc6kRXnNE' }).then((currentToken) => {
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
            // ...
            });
        

        const analytics = firebase.analytics();
        analytics.logEvent('Startup');
        return;
    }
}