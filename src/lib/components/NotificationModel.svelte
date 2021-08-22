<script lang='ts'>
	import { deregisterForPushNotifications, getMessagingToken } from '$lib/firebase/initFirebase';
	import { notificationSettings } from '$lib/store';

	setInterval(updatePermissionStatus, 1000);
	let notificationsEnabled: boolean = false;
	let notificationDenied = false;

	notificationSettings.subscribe((value) => {
		notificationsEnabled = value && (Notification.permission === 'granted');
	});

	let errorText = '';


	function updatePermissionStatus() {
		if (notificationSettings && Notification.permission !== 'granted') {
			// User has disabled notifications
			notificationSettings.set(false);
		}
		if (Notification.permission === 'denied') {
			errorText = 'Notifications have been blocked, check site permissions';
		}
		notificationDenied = Notification.permission === 'denied';
	}

	function enableNotifications() {
		Notification.requestPermission(function(status) {
			if (Notification.permission === 'granted') {
				getMessagingToken();
				notificationSettings.set(true);
			} else {
				errorText = 'Permission Denied';
			}
		});
	}

	function disableNotifications() {
		console.log('Disabling Notifications');
		deregisterForPushNotifications();
		notificationSettings.set(false);
		console.log('Disabled Notifications');
	}
</script>

<div>
	<h3>Notifications</h3>
	<p>
		Enable notifications within out app to be notified whenever new locations of interest
		appear. We will send a notification straight to your device alerting you to how many
		new locations have appeared.
	</p>
	<div class='fake-notif'>
		<h3 class='fake-notif__title'>New COVID-19 Locations of interest</h3>
		<p class='fake-notif__body'>There are 11 new COVID-19 locations of interest, check the app to see if there are any
			around you.</p>
		<span class='fake-notif__time'>1:38 pm <span class='dot'></span> toi.qrl.nz</span>
	</div>
	<div class='buttonContainer'>
		{#if notificationsEnabled}
			<button class='actionButton' on:click={disableNotifications}>Disable notifications</button>
		{:else}
			<button class='actionButton' on:click={enableNotifications} disabled={notificationDenied}>Enable notifications
			</button>
		{/if}
	</div>
	<div class='error'>{errorText}</div>
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
