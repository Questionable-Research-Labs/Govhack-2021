console.log("Running Notification Manager")

import { browser } from '$app/env';
import { deregisterForPushNotifications, getMessagingToken } from '$lib/firebase/initFirebase';
import { notificationSettings } from '$lib/store';
import { onMount } from 'svelte';

export let notificationsEnabled: boolean = false;
export let notificationDenied = false;
export let notificationsSupported = false;
export let notificationErrorText = '';





notificationSettings.subscribe((value) => {
    console.log("Updating Notification settings")

    if (notificationsSupported) {
        notificationsEnabled = value && (Notification.permission === 'granted');
    } else {
        notificationsEnabled = false
    }
});



export function updatePermissionStatus() {
    console.log("Updating Permissions")
    notificationsSupported = 'Notification' in window
    if (notificationsSupported) {
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
    console.log('Disabling Notifications');
    deregisterForPushNotifications();
    notificationSettings.set(false);
    console.log('Disabled Notifications');
}