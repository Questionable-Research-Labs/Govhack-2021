<script lang='ts'>
	import LeafletMap from '../lib/components/leaflet/LeafletMap.svelte';
	import DateSlider from '../lib/components/DateSlider.svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { GeoData } from '$lib/geoJsonResponse';
	import SearchBox from '$lib/components/SearchBox.svelte';
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
	<header class='header' id='header' >
		<ResultHeading dates={dateValues} />
		<SearchBox geoData={$geoData} />
	</header>
	<div class='mapUI'>
		<LeafletMap geoData={$geoData} dateRange={dateValues} />
	</div>
	<footer>
		<DateSlider bind:dateRange={dateValues} />
	</footer>
</main>

<style lang='scss'>
  main {
    min-height: 100vh;

    .mapUI {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .header {
    position: fixed;
    z-index: 1;
    width: 100%;
    top: 0;
    left: 0;
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

  .header-minimize-button {
    position: fixed;
    left: 0;
    top: 0;
    padding: 1em;
    z-index: 2;
  }
</style>
