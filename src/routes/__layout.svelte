<script lang="ts">
	import '../css/reset.scss';
	import '../css/global.scss';

	import Notifications from 'svelte-notifications';
	import FirebaseNotify from '$lib/components/FirebaseNotify.svelte';
</script>

<Notifications>
	<FirebaseNotify/>
	<slot/>
</Notifications>
