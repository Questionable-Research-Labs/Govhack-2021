<script lang="ts">
	import LeafletMap from '$lib/components/LeafletMap.svelte';
	import DateSlider from '$lib/components/DateSlider.svelte';
	import InfoBlock from '$lib/components/InfoBlock.svelte';

	import type { Writable, Readable } from 'svelte/store';
	import type { Tweened } from "svelte/motion";

	import { writable, readable } from 'svelte/store';
	import type { GeoData, Feature } from '$lib/geoJsonResponse';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import ResultHeading from '$lib/components/ResultHeading.svelte';
	import Filter from '$lib/filter.svelte';
	import moment, { Moment } from 'moment';
	import { MS_IN_DAY } from '$lib/consts';

	// FILTERS
	let fullDateRangeConfigured = false;
	let fullDateRange = [
		new Date().getTime() / MS_IN_DAY, // updated when geoData downloads
		new Date().getTime() / MS_IN_DAY
	];
	let dateRange: [number, number] = [
		Math.round(new Date().getTime() / MS_IN_DAY), // updated when geoData downloads
		Math.round(new Date().getTime() / MS_IN_DAY)
	];

	let searchTerm: string = '';

	// STATS

	let lastUpdate: Writable<Date> = writable();
	let loiCount: Tweened<number>;

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

	// FEATURES

	let geoData: GeoData | null = null;
	$: {
		if (geoData !== null && !fullDateRangeConfigured) {
			fullDateRangeConfigured = true
			let start_min = geoData.features.reduce(function (prev, curr) {
				return prev.properties.start.valueOf() < curr.properties.start.valueOf() ? prev : curr;
			});
			console.log('Start min', start_min.properties.start.valueOf());
			fullDateRange[0] = start_min.properties.start.valueOf() / MS_IN_DAY;
			dateRange[0] = fullDateRange[0];
		}
	}

	let filteredLocationList: [Feature, boolean][];
</script>

<main>
	<Filter
		bind:geoData
		bind:dateRange
		bind:searchTerm
		bind:filteredLocationList
		bind:loiCount
	/>
	<header class="header" id="header">
		<ResultHeading bind:dates={dateRange} />
		<SearchBox bind:searchTerm/>
		<div class="info-block-container">
			<InfoBlock>
				<a href="https://github.com/minhealthnz/nz-covid-data">
					Data from the New Zealand Government
				</a>
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
				<div class="map-key">
					<div class="labels">
						<div>Today</div>
						<div>Yesterday</div>
						<div>Before That</div>
					</div>
					<div class="bar" />
				</div>
			</InfoBlock>
		</div>
	</header>
	{#if geoData != null}
		<LeafletMap bind:filteredLocationList />
	{/if}

	<footer>
		<h1>Filter by Date <span class="desktop-explanation">(when there was a infection)</span></h1>
		<DateSlider
			bind:dateRange={activeDateValues}
			bind:fullRange={fullRangeActive}
			id="active-range-slider"
		/>
		<h1>Filter by date added <span class="desktop-explanation">(when it was discovered)</span></h1>
		<DateSlider
			bind:dateRange={addedDateValues}
			bind:fullRange={fullRangeAdded}
			showAll={true}
			id="added-range-slider"
		/>
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
	.info-block-container {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: calc(100%);
		z-index: 4;
		right: 0;
		align-items: flex-end;
		.map-key {
			display: grid;
			grid-template-columns: 1fr 1em;
			grid-column-gap: 0.2rem;
			height: 4em;

			.labels {
				text-align: right;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}
			.bar {
				height: 100%;
				background: linear-gradient(#f02b15 0%, #d751af 40%, #9171e1 80%, #2f86cc 100%);
				width: 1em;
				border-radius: 1rem;
			}
		}
	}

	footer {
		position: fixed;
		z-index: 1;
		width: 100%;
		bottom: 0;
		left: 0;
		padding: 1em;
		background-color: white;

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
