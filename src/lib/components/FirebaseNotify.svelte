<script lang="ts">
	import { initFirebase } from '$lib/firebase/initFirebase';
	import { onMount } from 'svelte';
	import { getNotificationsContext } from 'svelte-notifications';

	const notificationHandler = getNotificationsContext();

	function pushNotificationCallback(text: string) {
		console.log('Creating Notification');
		// If IDE go spaz, it's because there is a type bug in library, but this is the correct and only way
		// @ts-ignore
		notificationHandler.addNotification({
			text: text,
			position: 'top-right',
			type: 'success'
		});
	}
	onMount(() => {
		initFirebase(pushNotificationCallback);
	});
</script>
