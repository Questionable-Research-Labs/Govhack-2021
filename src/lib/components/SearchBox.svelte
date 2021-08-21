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
	<input type='text' bind:value={searchTerm}>
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

  @media only screen and (max-width: 380px) {
    .wrapper {
      flex-flow: column;
    }

    label {
      padding-bottom: 0.5em;
    }

    input {
      padding: 0.5em;
    }
  }
</style>