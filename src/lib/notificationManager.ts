console.log("Running Notification Manager")

import { browser } from '$app/env';
import { deregisterForPushNotifications, getMessagingToken } from '$lib/firebase/initFirebase';
import { notificationSettings,notificationTokenRegistered, notificationsEnabled } from '$lib/store';
import { onMount } from 'svelte';


export let notificationDenied = false;
const notificationsSupported = () => (typeof window === 'undefined') ? false : 'Notification' in window;
export let notificationErrorText = '';


let storeCaches = {"notificationTokenRegistered": false}

function updateNotificationEnabled() {
    console.log("Updating Notification settings");

    if (notificationsSupported()) {
        notificationsEnabled.set((Notification.permission === 'granted') && storeCaches["notificationTokenRegistered"] && storeCaches["notificationSettings"]);
    } else {
        notificationsEnabled.set(false)
    }
}

notificationSettings.subscribe((value) => {
    storeCaches["notificationSettings"] = value;
    updateNotificationEnabled();
});

notificationTokenRegistered.subscribe((value)=> {

    storeCaches["notificationTokenRegistered"] = value
    updateNotificationEnabled();
})


export function updatePermissionStatus() {
    if (notificationsSupported()) {
        notificationDenied = false
        if (notificationSettings && Notification.permission !== 'granted') {
            // User has disabled notifications
            notificationSettings.set(false);
        }
        if (Notification.permission === 'denied') {
            notificationErrorText = 'Notifications have been blocked, check site permissions';
        }
        notificationDenied = Notification.permission === 'denied';
    } else {
        notificationErrorText = 'Notifications not supported by your browser';
        notificationDenied = true
    }

}

export function enableNotifications() {
    Notification.requestPermission(function (status) {
        if (Notification.permission === 'granted') {
            notificationSettings.set(true);
            console.log("Permissions Received, trying to configure with Firebase.")
            getMessagingToken();
        } else {
            notificationErrorText = 'Permission Denied';
        }
    });
}

export function disableNotifications() {
    notificationSettings.set(false);
    deregisterForPushNotifications();

}