<script lang='ts'>
	import { GeoData } from '$lib/geoJsonResponse';
	import { afterUpdate, getContext } from 'svelte';
	import { Place } from '$lib/place';
	import SearchInfoModel from './models/searchInfoModel.svelte';
	import FuzzySearch from 'fuzzy-search';
	const { open } = getContext('simple-modal');

	export let geoData: GeoData | null;
	export let probablePlaces: ((places: Place[]) => void);
	let places: Place[] = [];

	$: places = geoData?.features.map((feature, index) => new Place(index, feature.properties.event + ', ' + feature.properties.location));

	let searchTerm = '';

	let fuse: FuzzySearch<Place>;
	$: fuse = new FuzzySearch(places, ['location'], {
		caseSensitive: false
	});

	function infoPopup() {
		open(SearchInfoModel, {  });
	}

	afterUpdate(() => {
		if (searchTerm === '') {
			probablePlaces(places);
		} else {
			probablePlaces(fuse.search(searchTerm));
		}
	});
</script>

<div class='wrapper'>
	<label for="searchBox">Filter by Address/Location</label>
	<button class="infoIcon" on:click={infoPopup} title="Search Information">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
			<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
			<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
		  </svg>
	</button>
	<input type='text' bind:value={searchTerm} placeholder='Enter Address/Location' id="searchBox">

</div>

<style lang='scss'>
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
	.infoIcon {
		margin-left: 0.5rem;
		border: none;
		background: none;
	}
	input {
		padding: 1em;
		margin-left: 1em;
	}
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
	.infoIcon {
		position: fixed;
		right: 0;
	}

    input {
      padding: 1em;
			width: 100%;
      font-size: 1em;
    }
  }
</style>