<script lang="ts">
	import { default as LeafletMap, loiCount } from '$lib/components/LeafletMap.svelte';
	import DateSlider from '$lib/components/DateSlider.svelte';
	import InfoBlock from '$lib/components/InfoBlock.svelte';

	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { GeoData } from '$lib/geoJsonResponse';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import ResultHeading from '$lib/components/ResultHeading.svelte';
	import moment, { Moment } from 'moment';
	import { MS_IN_DAY } from '$lib/consts';

	let full_range = [
		new Date().getTime() / MS_IN_DAY, // updated when geoData downloads
		new Date().getTime() / MS_IN_DAY
	];
	let dateValues: [number, number] = [
		Math.round(new Date().getTime() / MS_IN_DAY), // updated when geoData downloads
		Math.round(new Date().getTime() / MS_IN_DAY)
	];

	let geoData: Writable<null | GeoData> = writable(null);
	let lastUpdate: Writable<Date> = writable();
	let geoDataValue: null | GeoData;
	geoData.subscribe((e) => {
		geoDataValue = e;
		if (e !== null) {
			let start_min = e.features.reduce(function (prev, curr) {
				return prev.properties.start.valueOf() < curr.properties.start.valueOf() ? prev : curr;
			});
			console.log('Start min', start_min.properties.start.valueOf());
			full_range[0] = start_min.properties.start.valueOf() / MS_IN_DAY;
			dateValues[0] = full_range[0];
		}
	});

	let places: number[];

	$: console.log('Updated places ', places);

	fetch(
		'https://raw.githubusercontent.com/minhealthnz/nz-covid-data/main/locations-of-interest/august-2021/locations-of-interest.geojson'
	)
		.then((response) => response.json())
		.then((jsonData) => {
			if (geoDataValue === null) {
				geoData.set(new GeoData(jsonData));
			}
		})
		.catch((error) => {
			console.error('Could not fetch data:', error);
		});
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
</script>

<main>
	<header class="header" id="header">
		<ResultHeading bind:dates={dateValues} />
		<SearchBox geoData={$geoData} probablePlaces={(p) => (places = p?.map((e) => e.index))} />
		<div class="info-block-container">
			<InfoBlock>
				<a href="https://github.com/minhealthnz/nz-covid-data">
					Data from the New Zealand Government
				</a>
			</InfoBlock>
			<InfoBlock>
				{#if typeof $lastUpdate !== 'undefined'}
					Last updated {moment($lastUpdate).fromNow()}<br>
				{/if}

				{#if typeof $loiCount !== 'undefined'}
					Locations of interest: {$loiCount}
				{/if}
			</InfoBlock>
			<InfoBlock>
				<b style="margin-bottom: 0.5rem;">Discovery Date</b>		
				<div class="map-key">
					<div class="labels">
						<div>Today</div>
						<div>Yesterday</div>
						<div>Before That</div>

					</div>
					<div class="bar">

					</div>
				</div>
			</InfoBlock>
		</div>
	</header>
	{#if $geoData != null}
		<LeafletMap geoData={$geoData} dateRange={dateValues} filteredPlaces={places} />
	{/if}

	<footer>
		<DateSlider bind:dateRange={dateValues} bind:full_range />
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
				background: linear-gradient(#f02b15 0%,#D751AF 40%,#9171E1 80%, #2F86CC 100%);
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
	}

	@media all and (max-width: 770px) {
		.header {
			grid-template-columns: 1fr;
		}
	}
</style>
