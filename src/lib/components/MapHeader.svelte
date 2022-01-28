<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';
	import type { Tweened } from 'svelte/motion';
	import { browser } from '$app/env';

	import Datepicker from 'svelte-calendar/src/Components/Datepicker.svelte';
	import NotificationRequester from '$lib/components/NotificationRequester.svelte';
	import { MS_IN_DAY } from '$lib/consts';
	import { adjustForTimezone, dateToString } from '$lib/tools';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import InfoBlock from '$lib/components/InfoBlock.svelte';
	import { writable } from 'svelte/store';
	import moment from 'moment';
	
	export let fullRangeStartDate: number;
	export let dates: [number, number]; // The active date range 0 = start, 1 = end
	export let searchTerm: string;

	const genRoundedDate = () => {
		let x = new Date();
		x.setMinutes(0,0,0);
		return x
	}
	let lastUpdate: Writable<Date> = writable(genRoundedDate());

	export let loiCount: Tweened<number>;
	export let communityPins: boolean;
	export let noLocationPins: Tweened<number>;

	let startDate: Date;
	let endDate: Date;
	$: {
		if (dates) {
			startDate = new Date(Math.round(dates[0] * MS_IN_DAY));
			endDate = new Date(Math.round(dates[1] * MS_IN_DAY));
		}
	}
	const dateToTime = (date: Date): number => Math.round(date.getTime() / MS_IN_DAY);
	const pickStartCallback = () => (dates[0] = dateToTime(adjustForTimezone(startDate)));
	const pickEndCallback = () => (dates[1] = dateToTime(adjustForTimezone(endDate)));

	let screenWidth: number;

	let startDateDisplay: string = "";
	let endDateDisplay: string = "";

	$: startDateDisplay = lowSizeDateDisplay(dateToString(dates[0]), screenWidth);
	$: endDateDisplay = lowSizeDateDisplay(dateToString(dates[1]), screenWidth);


	function lowSizeDateDisplay(date: string, screenWidth: number): string {
		console.log(screenWidth);
		if (screenWidth < 330) {
			return `${date.split("-")[2]}th`;
		} else if (screenWidth < 420) {
			return date.split("-").slice(1).join("-");
		} else {
			return date
		}
	}
</script>
<svelte:window bind:innerWidth={screenWidth}/>

<header>
	<div class="block--first">
		<a class="logo" href="/" title="Times of Interest">
			<img class="logo__image" src="/icons/icon.svg" alt="Toi" width="128" height="128" />
		</a>
		<div class="pickers-wrapper">
			<div class="pickers">
				<Datepicker bind:selected={startDate} on:dateSelected={pickStartCallback} start={new Date(fullRangeStartDate * MS_IN_DAY)} end={new Date()}>
					<div class="picker__button" title="Select a starting date">
						<span>{startDateDisplay}</span>
					</div>
				</Datepicker>
				<span class="pickers__to">To</span>
				<Datepicker bind:selected={endDate} on:dateSelected={pickEndCallback} start={startDate} end={new Date()}>
					<div class="picker__button" title="Select a ending date">
						<span>{endDateDisplay}</span>
					</div>
				</Datepicker>
			</div>
			{#if screenWidth > 370}
				<p class="pickers-help">Click the date to open a calendar</p>
			{/if}
		</div>
		<div>
			<NotificationRequester />
		</div>
	</div>
	<div class="block--second">
		<SearchBox bind:searchTerm />
		<div class="info">
			<InfoBlock>
				<a href="https://github.com/minhealthnz/nz-covid-data" target="_blank" rel="nofollow noopener"> Data from the New Zealand Government </a>
				<span style="white-space: nowrap;"
					><a href="https://leafletjs.com" title="A JS library for interactive maps" target="_blank" rel="nofollow noopener">Leaflet</a> | ©
					<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="nofollow noopener">OpenStreetMap</a> contributors</span
				>
			</InfoBlock>
			<InfoBlock>
				{#if typeof $lastUpdate !== 'undefined'}
					<span title="The data comes directly from the MinHealthNZ, which updates every hour on the dot">
						Last updated: {moment($lastUpdate).fromNow()}<br />
					</span>
				{/if}

				{#if typeof $loiCount !== 'undefined'}
					<span title="Number of pins displayed on the map">
						Locations of interest: {$loiCount}
					</span>
				{/if}

				{#if typeof $noLocationPins !== 'undefined'}
					<span title="Some Locations of Interest don't have precise locations, so we can't display them on the map">
						Missing Pins: {$noLocationPins}
					</span>
				{/if}
			</InfoBlock>
			<InfoBlock>
				<b title="When the Location of Interest was indentified">Date Added</b>
				<div class="map-key" style="height: 4em;">
					<div class="labels">
						<div>Today</div>
						<div>Yesterday</div>
						<div>Before That</div>
					</div>
					<div class="key colour-bar" />
				</div>
				{#if communityPins}
					<div class="map-key">
						<div>Community</div>
						<div class="key community-key" />
					</div>
				{/if}
			</InfoBlock>
		</div>
	</div>
</header>

<style lang="scss">
	.info {
		position: absolute;
		top: 100%;
		right: 0;
		display: flex;
		flex-flow: column;
		align-items: flex-end;
		pointer-events: auto;

		.map-key {
			display: grid;
			grid-template-columns: 1fr 1em;
			grid-column-gap: 0.2rem;
			margin-top: 0.5rem;

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
			.community-key {
				background: #ffe330;
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
		pointer-events: none;
	}

	.block--first {
		position: relative;
		display: flex;
		align-items: center;

		background-color: #333333;

		margin-right: 5%;
		padding: 1em;
		z-index: 1;
		pointer-events: auto;

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
			box-shadow: 4px 2px 5px rgba(0, 0, 0, 0.5);
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
			font-size: 0.8rem;
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
			box-shadow: 4px 2px 5px rgba(0, 0, 0, 0.5);
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
