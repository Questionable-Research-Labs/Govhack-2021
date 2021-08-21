import { browser } from "$app/env";
import { writable } from "svelte/store";

// Notification Settings
let storedNotificationSettings;
if (browser) {
    storedNotificationSettings = localStorage.getItem("notificationSettings");
}
export const notificationSettings = writable(storedNotificationSettings);
if (browser) {
    notificationSettings.subscribe(value => {
        localStorage.setItem("notificationSettings", value === 'on' ? 'off' : 'on');
    });
    
}
