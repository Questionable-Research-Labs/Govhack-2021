<script lang="ts">
	import '../css/reset.scss';
	import '../css/global.scss';

	import Notifications from 'svelte-notifications';
	import Modal from 'svelte-simple-modal';
	import FirebaseNotify from '$lib/components/FirebaseNotify.svelte';
	import { updatePermissionStatus } from '$lib/notificationManager';

	import { onMount } from 'svelte';

	onMount(() => {
		console.log(
			'%c TIMES OF INTEREST IS SUS %c - Jasper Miller-Waugh 22/8/2021',
			'font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)',
			'font-weight: inital; font-size: inital;inital; text-shadow: inital'
		);
		console.log('Loading Permissions');
		setInterval(updatePermissionStatus, 1000);
		updatePermissionStatus();
		console.log('Permission Status Loaded');
		window.history.replaceState(null, null, window.location.pathname);

	});
</script>

<svelte:head>
	<title>Toi | Times of Interest</title>
</svelte:head>

<Notifications>
	<Modal>
		<FirebaseNotify />
		<slot />
	</Modal>
</Notifications>
