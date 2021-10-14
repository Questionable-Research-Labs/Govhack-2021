<script lang="ts">
	import LeafletMap from '$lib/components/LeafletMap.svelte';
	import DateSlider from '$lib/components/DateSlider.svelte';
	import InfoBlock from '$lib/components/InfoBlock.svelte';

	import type { Writable } from 'svelte/store';
	import type { Tweened } from 'svelte/motion';

	import { writable } from 'svelte/store';
	import type { GeoData, Feature } from '$lib/geoJsonResponse';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import ResultHeading from '$lib/components/ResultHeading.svelte';
	import Filter from '$lib/filter.svelte';
	import moment, { Moment } from 'moment';
	import { MS_IN_DAY } from '$lib/consts';
	import MapHeader from '$lib/components/MapHeader.svelte';

	// FILTERS
	let fullDateRangesConfigured = false;

	const initialTime = new Date().getTime();
	const initialTimeInS = Math.round(initialTime / MS_IN_DAY);

	let fullActiveDateRange = [
		initialTimeInS, // updated when geoData downloads
		initialTimeInS
	];
	let activeDateRange: [number, number] = [
		initialTimeInS, // updated when geoData downloads
		initialTimeInS
	];

	let fullAddedDateRange: [number, number] = [
		initialTimeInS, // updated when geoData downloads
		initialTimeInS
	];
	let addedDateRange: [number, number] = [
		initialTimeInS, // updated when geoData downloads
		initialTimeInS
	];

	let searchTerm: string = '';

	// STATS

	let loiCount: Tweened<number>;

	// FEATURES

	let geoData: GeoData | null = null;
	$: {
		if (geoData !== null && !fullDateRangesConfigured) {
			fullDateRangesConfigured = true;
			let activeStartMin = geoData.features.reduce(function (prev, curr) {
				return prev.properties.start.valueOf() < curr.properties.start.valueOf() ? prev : curr;
			});

			fullActiveDateRange[0] = Math.round(activeStartMin.properties.start.valueOf() / MS_IN_DAY);
			activeDateRange[0] = Math.round(fullActiveDateRange[0]);

			let addedStartMin = geoData.features.reduce((prev, curr) =>
				curr.properties.dateAdded.isValid()
					? prev.properties.dateAdded.valueOf() < curr.properties.dateAdded.valueOf()
						? prev
						: curr
					: prev
			);
			console.log('added Site Min', addedStartMin);
			fullAddedDateRange[0] = Math.round(addedStartMin.properties.dateAdded.valueOf() / MS_IN_DAY);
			addedDateRange[0] = Math.round(fullAddedDateRange[0]);
		}
	}

	let filteredLocationList: [Feature, boolean][];
</script>

<main>
	<Filter
		bind:geoData
		bind:activeDateRange
		bind:addedDateRange
		bind:searchTerm
		bind:filteredLocationList
		bind:loiCount
		bind:fullAddedDateRange
	/>
	<MapHeader bind:dates={activeDateRange} bind:searchTerm bind:loiCount />
	{#if geoData != null}
		<LeafletMap bind:filteredLocationList />
	{/if}

	<footer>
		<h1>Filter by Date <span class="desktop-explanation">(when there was a infection)</span></h1>
		<DateSlider bind:dateRange={activeDateRange} bind:fullRange={fullActiveDateRange} id="active-range-slider" />
		<h1>Filter by date added <span class="desktop-explanation">(when it was discovered)</span></h1>
		<DateSlider bind:dateRange={addedDateRange} bind:fullRange={fullAddedDateRange} id="added-range-slider" />
	</footer>
</main>

<style lang="scss">
	main {
		min-height: 100vh;
	}

	.header {
		position: fixed;
		z-index: 1;
		width: 100%;
		top: 0;
		left: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		background-color: white;
	}
	footer {
		position: fixed;
		z-index: 1;
		width: 100%;
		bottom: 0;
		left: 0;
		padding: 1em;
		background-color: white;
		transform: translateY(calc(100%));
		transition: transform 100ms ease-out;

		&:hover {
			transform: translateY(0);
		}

		&::before {
			content: '^';
			position: absolute;
			text-align: center;
			top: -2rem;
			left: 50%;
			transform: translateX(-50%);
			background-color: white;
			padding: 0.5rem 2rem;
			border-radius: 5px 5px 0 0;
			font-weight: bolder;
		}

		h1 {
			text-align: center;
			font-size: 10pt;
			font-weight: 300;

			&:last-child {
				padding-top: 1em;
			}
		}
	}

	@media all and (max-width: 770px) {
		.header {
			grid-template-columns: 1fr;
		}
		.desktop-explanation {
			display: block;
		}

		footer {
			padding: 0;
		}
	}
</style>
