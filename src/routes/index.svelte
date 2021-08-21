<script lang="ts">
	import LeafletMap from '../lib/components/leaflet/LeafletMap.svelte';
	import DateSlider from '../lib/components/DateSlider.svelte';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import { GeoData } from '$lib/geoJsonResponse';
	import {MS_IN_DAY} from "$lib/consts";
	import SearchBox from "$lib/components/SearchBox.svelte";
	import ResultHeading from '$lib/components/ResultHeading.svelte';

    let dateValues: [number, number];
	let geoData: Writable<null | GeoData> = writable(null);
	let geoDataValue: null | GeoData;
	geoData.subscribe((e) => {
		geoDataValue = e;
	});

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
</script>

<main>
	<ResultHeading dates={dateValues}/>
	<DateSlider bind:dateRange={dateValues}/>
	<SearchBox geoData={$geoData}/>
	<div class="mapUI">
		<LeafletMap geoData={$geoData} dateRange={dateValues} />
	</div>
</main>

<style lang="scss">
	main {
		min-height: 100vh;
		.mapUI {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
	}
</style>
