<script lang='ts'>

	import type { Writable } from 'svelte/store';
	import type { Tweened } from 'svelte/motion';

	import Datepicker from 'svelte-calendar/src/Components/Datepicker.svelte';
	import NotificationRequester from '$lib/components/NotificationRequester.svelte';
	import { MS_IN_DAY } from '$lib/consts';
	import { dateToString } from '$lib/tools';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import InfoBlock from '$lib/components/InfoBlock.svelte';
	import { writable } from 'svelte/store';
	import moment from 'moment';

	export let dates: [number, number]; // The active date range 0 = start 1 = end
	export let searchTerm: string;

	let lastUpdate: Writable<Date> = writable();
	export let loiCount: Tweened<number>;

	(async () => {
		try {
			let response = await fetch('https://govhack2021-backend.host.qrl.nz/updated');
			let body = await response.json();
			console.log('Date pushed', body['getDatePushed']);
			lastUpdate.set(new Date(body['getDatePushed']));
		} catch (e) {
			console.log('It shit itself', e);
		}
	})();

	let startDate: Date;
	let endDate: Date;

	$: {
		if (dates) {
			startDate = new Date(Math.round(dates[0] * MS_IN_DAY));
			endDate = new Date(Math.round(dates[1] * MS_IN_DAY));
		}
	}

	const dateToTime = (date: Date): number => Math.round(date.getTime() / MS_IN_DAY);
	const pickStartCallback = () => dates[0] = dateToTime(startDate);
	const pickEndCallback = () => dates[1] = dateToTime(endDate);

</script>

<header>
	<div class='block--first'>
		<a class='logo' href='/' title='Times of Interest'>
			<img class='logo__image' src='/icons/icon.svg' alt='Toi' width='128' height='128' />
		</a>
		<div class='pickers-wrapper'>
			<div class='pickers'>
				<Datepicker
					bind:selected={startDate}
					on:dateSelected={pickStartCallback}
					end={new Date()}>
					<div class='picker__button' title='Select a ending date'>
						<span>{dateToString(dates[0])}</span>
					</div>
				</Datepicker>
				<span class='pickers__to'>To</span>
				<Datepicker
					bind:selected={endDate}
					on:dateSelected={pickEndCallback}
					start={startDate}
					end={new Date()}>
					<div class='picker__button' title='Select a starting date'>
						<span>{dateToString(dates[1])}</span>
					</div>
				</Datepicker>
			</div>
			<p class='pickers-help'>Click the date to open a calendar</p>
		</div>
		<div>
			<NotificationRequester />
		</div>
	</div>
	<div class='block--second'>
		<SearchBox bind:searchTerm />
		<div class='info'>
			<InfoBlock>
				<a href="https://github.com/minhealthnz/nz-covid-data"> Data from the New Zealand Government </a>
				<span style="white-space: nowrap;"
				><a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | ©
					<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</span
				>
			</InfoBlock>
			<InfoBlock>
				{#if typeof $lastUpdate !== 'undefined'}
					Last updated {moment($lastUpdate).fromNow()}<br />
				{/if}

				{#if typeof $loiCount !== 'undefined'}
					Locations of interest: {$loiCount}
				{/if}
			</InfoBlock>
			<InfoBlock>
				<b style="margin-bottom: 0.5rem;">Date Added</b>
				<div class="map-key" style="height: 4em;">
					<div class="labels">
						<div>Today</div>
						<div>Yesterday</div>
						<div>Before That</div>
					</div>
					<div class="key colour-bar" />
				</div>
			</InfoBlock>
		</div>
	</div>
</header>

<style lang='scss'>

	.info {
    position: absolute;
		top: 100%;
		right: 0;
		display: flex;
		flex-flow: column;
    align-items: flex-end;
    .map-key {

      display: grid;
      grid-template-columns: 1fr 1em;
      grid-column-gap: 0.2rem;

      .labels {
        text-align: right;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .key {
        height: 100%;
        width: 1em;
        border-radius: 1rem;
      }
      .colour-bar {
        background: linear-gradient(#f02b15 0%, #d751af 40%, #9171e1 80%, #2f86cc 100%);
      }
      .unknown-key {
        background: #707F89;
      }
    }
	}

  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;

    display: flex;
    background-color: transparent;
  }

  .block--first {
		position: relative;
    display: flex;
    align-items: center;

    background-color: #333333;

    margin-right: 5%;
    padding: 1em;
    z-index: 1;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: skew(-30deg) translateX(10%);
      background-color: #333333;
      z-index: -1;
      box-shadow: 4px 2px 5px rgba(0,0,0,0.5);
    }
  }

  .block--second {
    position: relative;
    display: flex;
		flex: 1 1 auto;
		justify-content: flex-end;
  }

	.pickers-wrapper {
		display: flex;
		flex-flow: column;
    margin: 0 1em 0 1.5em;
	}

	.pickers-help {
		font-size: 0.8em;
		color: gray;
    margin: 0.5em 0 0;
  }


  .pickers {
    display: flex;
    flex-flow: row;
    align-items: center;
    text-align: center;

    &__to {
      color: white;
      margin: 0 0.5em;
      font-size: 1.2em;
      font-weight: bold;
    }
  }

  .picker__button {
    cursor: pointer;
    padding: 0.5em;
    margin: 0;

    font-weight: bold;
    border: #ffe330 2px solid;
    background-color: #ffe330;
    color: #222222;
    transition: all 0.2s ease;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0);
    border-radius: 0.25em;

    &:hover {
      background-color: #ffe330;
      box-shadow: 2px 2px 10px rgb(75, 70, 70);
    }

		> span {
			font-size: 1.2em;
		}
  }

  .logo {

    &__image {
      width: 64px;
      height: 64px;
    }


  }

  @media all and (max-width: 1000px) {
    .picker__button {
			> span {
				font-size: 1em;
			}
    }

		.block--first {
			padding: 0.5em;
		}

    .pickers-wrapper {
      margin: 0 0.7em 0 1em;
    }
  }

  @media all and (max-width: 840px) {
    .block--first {
			margin-right: 0;
			padding-right: 2em;
			&::before {
				display: none;
			}
		}

		.block--second {
			flex: 1 1 auto;
      background-color: white;
      box-shadow: 4px 2px 5px rgba(0,0,0,0.5);
			justify-content: center;
		}
  }

	@media all and (max-width: 715px) {
    header {
			flex-flow: column;
		}

		.pickers-wrapper {
			flex: 1 1 auto;
		}

		.pickers-help {
			text-align: center;

		}
  }

</style>