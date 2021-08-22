import { browser } from '$app/env';
import { Writable, writable } from 'svelte/store';

// Notification Settings
let storedNotificationSettings;
if (browser) {
	storedNotificationSettings = localStorage.getItem('notificationSettings') === 'on';
	console.log('stored notification settings', storedNotificationSettings);
}

export const notificationSettings: Writable<boolean> = writable(storedNotificationSettings);
if (browser) {
	notificationSettings.subscribe(async (value) => {
		localStorage.setItem('notificationSettings', value ? 'on' : 'off');

		navigator.serviceWorker.ready
			.then(function (serviceWorkerRegistration) {
				// Let's see if you have a subscription already
				return serviceWorkerRegistration.pushManager.getSubscription();
			})
			.then(function (subscription) {
				if (!subscription) {
					// You do not have subscription
				}
				// You have subscription.
				// Send data to service worker
				navigator.serviceWorker.controller.postMessage({
					type: 'NOTIFICATION_SETTINGS',
					value: JSON.stringify(value)
				});
			});
	});
}
