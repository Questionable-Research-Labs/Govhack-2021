<script lang="ts">
	import { initFirebase } from '$lib/firebase/initFirebase';
	import { onMount } from 'svelte';
	import { getNotificationsContext } from 'svelte-notifications';

	const notificationHandler = getNotificationsContext();

	function pushNotificationCallback(text: string) {
		console.log('Creating Notification');
		notificationHandler.addNotification({
			text: text,
			position: 'top-right',
			removeAfter: 4000
		});
	}
	onMount(() => {
		initFirebase(pushNotificationCallback);
	});
</script>
