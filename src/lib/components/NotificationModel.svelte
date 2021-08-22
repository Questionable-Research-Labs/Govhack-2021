<script lang="ts">
	import {getMessagingToken,deregisterForPushNotifications  } from "$lib/firebase/initFirebase"
	import {notificationSettings} from "$lib/store";

	setInterval(updatePermissionStatus,1000)
	let notificationsEnabled: boolean = false;
	let notificationDenied = false;

	notificationSettings.subscribe((value)=>{
		notificationsEnabled = value&&(Notification.permission ==="granted")
	})

	let errorText = "";

	
	
	function updatePermissionStatus() {
		if (notificationSettings && Notification.permission !=="granted") {
			// User has disabled notifications
			notificationSettings.set(false)
		}
		if (Notification.permission ==="denied") {
			errorText = "Notifications have been blocked, check site permissions"
		}
		notificationDenied = Notification.permission ==="denied"
	}

	function enableNotifications() {
		Notification.requestPermission(function (status) {
		    if (Notification.permission ==="granted") {
				getMessagingToken()
				notificationSettings.set(true);
			} else {
				errorText = "Permission Denied"
			}
		});
	}

	function disableNotifications() {
		console.log("Disabling Notifications")
		deregisterForPushNotifications();
		notificationSettings.set(false);
		console.log("Disabled Notifications")
	}
</script>

<div>
	<h3>Notifications</h3>
	<p>
		Enable notifiactions to do things wow text here lol I can't english Lorem ipsum dolor sit amet
		consectetur, adipisicing elit. Voluptatibus esse obcaecati enim, expedita inventore facere unde
		adipisci, dolore, quaerat reiciendis culpa distinctio debitis laborum explicabo! Aperiam aliquid
		rem soluta unde.

		<br />
		<br />

		Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatibus esse obcaecati enim,
		expedita inventore facere unde adipisci, dolore, quaerat reiciendis culpa distinctio debitis
		laborum explicabo! Aperiam aliquid rem soluta unde. Lorem ipsum dolor sit amet consectetur,
		adipisicing elit. Voluptatibus esse obcaecati enim, expedita inventore facere unde adipisci,
		dolore, quaerat reiciendis culpa distinctio debitis laborum explicabo! Aperiam aliquid rem
		soluta unde.
		<br />
		<br />

		Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatibus esse obcaecati enim,
		expedita inventore facere unde adipisci, dolore, quaerat reiciendis culpa distinctio debitis
		laborum explicabo! Aperiam aliquid rem soluta unde.
	</p>
	<div class="buttonContainer">
		{#if notificationsEnabled} 
			<button class="actionButton" on:click={disableNotifications}>Disable notifications</button>
		{:else}
			<button class="actionButton" on:click={enableNotifications} disabled={notificationDenied}>Enable notifications</button>
		{/if}
	</div>
	<div class="error">{errorText}</div>
</div>

<style lang="scss">
	.actionButton {
		background-color: #333;
		color: white;
		border-radius: 5px;
		padding: 0.5rem;
		border: none;
		font-size: 1.5rem;
		&:disabled {
			background-color: rgb(112, 112, 112);
		}
	}
	.buttonContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
	.error {
		color: rgb(189, 5, 5);
		text-align: center;
	}
</style>
