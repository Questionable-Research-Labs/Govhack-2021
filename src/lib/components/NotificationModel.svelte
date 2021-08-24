<script lang='ts'>
	import * as notify from "$lib/notificationManager";
  import { notificationsEnabled } from "$lib/store";
  import { onMount } from 'svelte';

  onMount(()=>{
    console.log("ClientSide");
    setInterval(notify.updatePermissionStatus, 1000);
    notify.updatePermissionStatus();
  })

  notificationsEnabled.subscribe((value)=>{
    console.log("Value Changed")
  })
</script>

<div>
	<h3>Notifications</h3>
	<p>
		Enable notifications within our app to be notified whenever new locations of interest
		appear. We will send a notification straight to your device alerting you to how many
		new locations have appeared.
	</p>
	<div class='fake-notif'>
		<h3 class='fake-notif__title'>New COVID-19 Locations of interest</h3>
		<p class='fake-notif__body'>There are 11 new COVID-19 locations of interest, check the app to see if there are any
			around you.</p>
		<span class='fake-notif__time'>1:38 pm <span class='dot'></span> toi.qrl.nz</span>
	</div>
	<p>
		We will provide you with notifications similar to the image above and you will receive
		these whenever a new location of interest is added.
	</p>
	<div class='buttonContainer'>
		{#if $notificationsEnabled}
			<button class='actionButton' on:click={notify.disableNotifications}>Disable notifications</button>
		{:else}
			<button class='actionButton' on:click={notify.enableNotifications} disabled={notify.notificationDenied}>Enable notifications
			</button>
		{/if}
	</div>
	<div class='error'>{@html notify.notificationErrorText}</div>
</div>

<style lang='scss'>

  .fake-notif {
    padding: 1em;
    background: #333333;

    &__title {
      font-size: 1em;
      margin: 0;
      margin-bottom: 0.5em;
      color: white;
    }

    &__body {
      margin: 0;
      color: gray;
      line-height: 1.5;
    }

    &__time {
      display: block;
      color: gray;
      margin-top: 0.7em;
      font-size: 0.8em;

      .dot {
        display: inline-block;
        width: 4px;
        height: 4px;
        background: gray;
        border-radius: 16px;
        margin-bottom: 2px;
      }

    }
  }

  .actionButton {
    background-color: #333;
    color: white;
    padding: 1rem;
    border: none;
    cursor: pointer;
    font-weight: bold;
		letter-spacing: 0.1em;
		margin-bottom: 1em;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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

	p {
		line-height: 1.5;
	}
</style>
