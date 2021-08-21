<script>
	import {getMessagingToken,deregisterForPushNotifications  } from "$lib/firebase/initFirebase"
	import {notificationSettings} from "$lib/store";

	 

	function enableNotifications() {

	}

	function disableNotifications() {
		
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
		{#if notificationSettings=="on"} 
			<button class="actionButton" on:click={disableNotifications}>Disable notifications</button>
		{:else}
			<button class="actionButton" on:click={enableNotifications}>Enable notifications</button>
		{/if}
	</div>
</div>

<style lang="scss">
	.actionButton {
		background-color: #333;
		color: white;
		border-radius: 5px;
		padding: 0.5rem;
		border: none;
		font-size: 1.5rem;
	}
	.buttonContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
</style>
