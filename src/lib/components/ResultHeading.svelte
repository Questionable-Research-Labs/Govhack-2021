<script lang="ts">
	import { dateToString } from '$lib/tools';
	import NotificationRequester from '$lib/components/NotificationRequester.svelte';
	import Datepicker from 'svelte-calendar/src/Components/Datepicker.svelte';

	import { MS_IN_DAY } from '$lib/consts';

	export let dates: [number, number];

	$: chosenStart = new Date(dates[0] * MS_IN_DAY);
	$: chosenEnd = new Date(dates[1] * MS_IN_DAY);
	function timeFromDate(date: Date): number {
		return Math.round(date.getTime() / MS_IN_DAY);
	}

	function chosenStartCallback() {
		console.log('Start Chosen', chosenStart);
		dates[0] = timeFromDate(chosenStart);
	}
	function chosenEndCallback() {
		console.log('Start Chosen', chosenStart);
		dates[1] = timeFromDate(chosenEnd);
	}
</script>

{#if dates}
	<div class="results-info">
		<div class="notificationRequesterWrapper">
			<NotificationRequester />
		</div>
		<a href="/"><img class="icon" src="/icons/icon.svg" alt="Toi" width="128" height="128" /></a>

		<h3 class="title">Showing Results</h3>
		<div class="body">
			<!-- Another broken library... Works fully but types are broken. -->
			<Datepicker bind:selected={chosenEnd} on:dateSelected={chosenEndCallback} start={chosenStart} end={new Date()}>
				<div class="calenderInner" title="End Date Selector">
					To
					<span>{dateToString(dates[1])}</span>
				</div>
			</Datepicker>
			<Datepicker bind:selected={chosenStart} on:dateSelected={chosenStartCallback} end={chosenEnd}>
				<div class="calenderInner" title="Start Date Selector">
					From
					<span>{dateToString(dates[0])}</span>
				</div>
			</Datepicker>
		</div>
	</div>
{/if}

<style lang="scss">
	.results-info {
		text-align: left;
		display: flex;
		flex-flow: row;
		position: relative;
		align-items: center;
		padding: 1em 6em 1em 1em;

		.notificationRequesterWrapper {
			position: absolute;
			margin: 1em;
			top: 0;
			right: 7.75%;
			z-index: 2;
			color: white;
		}
		.icon {
			width: 60px;
			height: 60px;
			margin-right: 0.5em;
		}

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			background-color: #333;
			width: 100%;
			height: 100%;
			transform: skewX(-30deg) translateX(-5%);
			z-index: -1;
		}

		.title {
			font-size: 1.25em;
			font-weight: bold;
			margin: 0 1em 0.5em 0.5em;
			color: white;
		}

		.body {
			.calenderInner {
				text-transform: uppercase;
				background-color: #ffe330;

				padding: 1em;
				color: black;
				font-weight: bold;
				display: inline-block;
				margin-right: 1em;

				cursor: pointer;
			}
		}
	}

	@media all and (max-width: 1200px) {
		.results-info {
			text-align: center;
			flex-flow: column;
			&::before {
				width: 120%;
				transform: skewX(-30deg) translateX(-20%);
			}
		}
	}

	@media all and (max-width: 770px) {
		.results-info {
			padding: 1em;

			&::before {
				width: 100%;
				transform: skewX(0) translateX(0);
			}
		}
	}

	@media all and (max-width: 440px) {
		.calenderInner {
			font-size: 0.7em;
		}
	}
</style>
