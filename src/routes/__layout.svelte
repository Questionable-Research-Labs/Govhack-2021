<script lang="ts">
	import "../css/reset.scss";
	import "../css/global.scss";

	import { initFirebase } from "$lib/firebase/initFirebase";
	import { onMount } from "svelte";

	onMount(()=> {
		initFirebase();
		Notification.requestPermission(function(status) {
			console.log('Notification permission status:', status);
		});

	})
</script>
<slot></slot>
