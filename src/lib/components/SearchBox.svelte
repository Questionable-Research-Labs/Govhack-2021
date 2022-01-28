<script lang='ts'>
	import { getContext } from 'svelte';
	import SearchInfoModel from './models/searchInfoModel.svelte';

	const { open } = getContext('simple-modal');

	// export let probablePlaces: ((places: Place[]) => void);
	// let places: Place[] = [];

	// $: places = geoData?.features.map((feature, index) => new Place(index, feature.properties.event + ', ' + feature.properties.location));

	export let searchTerm = '';

	// let fuse: FuzzySearch<Place>;
	// $: fuse = new FuzzySearch(places, ['location'], {
	// 	caseSensitive: false
	// });

	function infoPopup() {
		open(SearchInfoModel, {});
	}
</script>

<div class='wrapper'>
	<label class='search'>
		<svg class='search__icon' xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px'
				 fill='var(--icon-colour)'>
			<path d='M0 0h24v24H0z' fill='none' />
			<path
				d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' />
		</svg>
		<input class='search__input' type='text' bind:value={searchTerm} placeholder='Enter Address/Location'
					 id='searchBox' />
		<button class='search__info' on:click={infoPopup} title='Lean more about searching'>
			<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='var(--icon-colour)'>
				<path d='M0 0h24v24H0z' fill='none' />
				<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' />
			</svg>
		</button>
	</label>
</div>

<style lang='scss'>

  label {
    vertical-align: bottom;
    font-size: 1em;
  }

  .wrapper {
    display: flex;
    align-items: center;
    vertical-align: baseline;
    text-align: right;
    width: auto;
    background-color: white;
    box-shadow: 4px 2px 5px rgba(0, 0, 0, 0.5);
    padding: 1em 1.5em;
    border-bottom-left-radius: 0.25em;

    pointer-events: auto;

  }

  @media all and (max-width: 840px) {
    .wrapper {
      background-color: transparent;
      box-shadow: none;
    }
  }

  @media all and (max-width: 715px) {
    .wrapper {
      padding: 0;
			width: 100%;
      font-size: 0.8rem;
    }

		.search {
			width: 100%;
		}
  }

  .info-icon {
    cursor: pointer;
    padding: 0;
    color: black;
    margin-right: 1em;
  }

  .search {
    display: flex;
    align-items: center;
    border: 2px solid #b1b1b1;
    border-radius: 0.2em;
    --icon-colour: #b1b1b1;

    &__icon {
      margin: 0.5em 0.5em 0.5em 1em;
    }

    &__info {
      background-color: transparent;
      border: none;
      height: 24px;
      width: 24px;
      margin-right: 1em;
      --icon-colour: #b1b1b1;

      &:hover {
        --icon-colour: #333333;
      }

      > svg {
        margin: 0;
        padding: 0;
      }

    }

    &__input {
			flex: 1 1 auto;
      padding: 1em;
      border: none;
      background-color: transparent;
    }


    &:focus-within {
      border-color: #333333;
      --icon-colour: #333333;

    }
  }

  input {

  }

  @media all and (max-width: 975px) {

  }
</style>
