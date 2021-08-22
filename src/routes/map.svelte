<script lang="ts">
	import LeafletMap from '$lib/components/LeafletMap.svelte';
	import DateSlider from '$lib/components/DateSlider.svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { GeoData } from '$lib/geoJsonResponse';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import ResultHeading from '$lib/components/ResultHeading.svelte';
	import moment, { Moment } from 'moment';

	let dateValues: [number, number];
	let geoData: Writable<null | GeoData> = writable(null);
	let lastUpdate: Writable<Moment> = writable();
	let loiCount: Writable<number> = writable(0);
	let geoDataValue: null | GeoData;
	geoData.subscribe((e) => {
		geoDataValue = e;
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
			lastUpdate.set(moment(body['datePushed']));
		} catch (e) {
			console.log('It shit itself', e);
		}
	})();
	(async () => {
		try {
			let response = await fetch('https://govhack2021-backend.host.qrl.nz/loi');
			let body = await response.json();
			console.log(body);
			loiCount.set(body['loi']);
		} catch (e) {
			console.log('It shit itself', e);
		}
	})();
</script>

<main>
	<header class="header" id="header">
		<ResultHeading dates={dateValues} />
		<SearchBox geoData={$geoData} probablePlaces={(p) => (places = p?.map((e) => e.index))} />
		<div class="update-block">
			{#if typeof $lastUpdate !== 'undefined'}
				<p class="update-block__text">Last Updated {$lastUpdate.format('DD/MM/YYYY HH:mm:ss')}</p>
			{/if}

			{#if typeof $loiCount !== 'undefined'}
				<p class="update-block__text">Number of locations of interest: {$loiCount}</p>
			{/if}
		</div>
	</header>
	{#if $geoData != null}
		<LeafletMap geoData={$geoData} dateRange={dateValues} filteredPlaces={places} />
	{/if}
	<footer>
		<DateSlider bind:dateRange={dateValues} />
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
	}

	@media all and (max-width: 770px) {
		.header {
			grid-template-columns: 1fr;
		}
	}

	.update-block {
		position: absolute;
		top: calc(100% + 1em);
		right: 1em;
		display: flex;
		flex-flow: column;
	}

	.update-block__text {
		font-size: 0.75em;
		background: #333;
		display: inline;
		color: white;
		padding: 0.5em;
		border-radius: 0.5em;
	}
</style>
