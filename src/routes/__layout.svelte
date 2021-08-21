<script lang="ts">
	import '../css/reset.scss';
	import '../css/global.scss';

	import Notifications from 'svelte-notifications';
	import Modal from 'svelte-simple-modal';
	import FirebaseNotify from '$lib/components/FirebaseNotify.svelte';
</script>

<svelte:head>
	<title>Toi | Times of Interest</title>
</svelte:head>

<Notifications>
	<Modal>
		<FirebaseNotify/>
		<slot/>
	</Modal>
</Notifications>
