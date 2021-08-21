<script lang='ts'>
	import { GeoData } from '$lib/geoJsonResponse';
	import { afterUpdate } from 'svelte';
	import { Place } from '$lib/place';
	import FuzzySearch from 'fuzzy-search';

	export let geoData: GeoData | null;
	export let probablePlaces: ((places: Place[]) => void);
	let places: Place[] = [];

	$: places = geoData?.features.map((feature, index) => new Place(index, feature.properties.event + ', ' + feature.properties.location));

	let searchTerm = '';

	let fuse: FuzzySearch<Place>;
	$: fuse = new FuzzySearch(places, ['location'], {
		caseSensitive: false
	});

	afterUpdate(() => {
		if (searchTerm === '') {
			probablePlaces(places);
		} else {
			probablePlaces(fuse.search(searchTerm));
		}
	});
</script>

<div class='wrapper'>
	<label>Address/Location</label>
	<input type='text' bind:value={searchTerm} placeholder='Enter Address/Location'>
</div>

<style lang='scss'>
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  input {
    padding: 1em;
    margin-left: 1em;
  }

  @media all and (max-width: 770px) {
		.wrapper {
      padding: 1em 0;
		}
  }

  @media only screen and (max-width: 440px) {

    .wrapper {
      flex-flow: column;
			padding: 0;
    }

    label {
      font-size: 0.7em;
      padding-bottom: 0.5em;
			display: none;
    }

    input {
      padding: 1em;
			width: 100%;
      font-size: 1em;
    }
  }
</style>