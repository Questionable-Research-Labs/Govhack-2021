<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, stuff }) {
		return {
			props: {
				queryMarker: page.query.get('marker')
			}
		};
	}
</script>

<script lang="ts">
	import LeafletMap from '$lib/components/LeafletMap.svelte';
	import DateSlider from '$lib/components/DateSlider.svelte';
	import InfoBlock from '$lib/components/InfoBlock.svelte';

	import type { Writable } from 'svelte/store';
	import type { Tweened } from 'svelte/motion';

	import { writable } from 'svelte/store';
	import type { GeoData, Feature } from '$lib/loiData';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import ResultHeading from '$lib/components/ResultHeading.svelte';
	import Filter from '$lib/filter.svelte';
	import moment, { Moment } from 'moment';
	import { MS_IN_DAY } from '$lib/consts';
	import MapHeader from '$lib/components/MapHeader.svelte';

	// QUERY MARKER
	export let queryMarker;

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

	// HEADER INFO

	let loiCount: Tweened<number>;

	// FEATURES

	let geoData: GeoData | null = null;
	$: {
		if (geoData !== null && !fullDateRangesConfigured) {
			fullDateRangesConfigured = true;
			let activeStartMin = geoData.loi.reduce(function (prev, curr) {
				return prev.properties.start.valueOf() < curr.properties.start.valueOf() ? prev : curr;
			});

			fullActiveDateRange[0] = Math.round(activeStartMin.properties.start.valueOf() / MS_IN_DAY);
			activeDateRange[0] = Math.round(fullActiveDateRange[0]);

			let addedStartMin = geoData.loi.reduce((prev, curr) =>
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

	// DATE SLIDER CONTROLS
	let footerShowen = false;
	let footerHideTimeout;

	function toggleFooter() {
		console.log('Showing',footerShowen);
		footerShowen = !footerShowen;
	}
	function showFooter() {
		if (typeof footerHideTimeout!=="undefined") {
			clearTimeout(footerHideTimeout);
			footerHideTimeout = undefined;
		}
		setTimeout(function () {
			footerShowen = true;
		}, 1);
	}
	function hideFooterDelay() {
		footerHideTimeout = setTimeout(function () {
			footerShowen = false;
		}, 400);
	}
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
	<MapHeader bind:dates={activeDateRange} bind:searchTerm bind:loiCount communityPins={geoData?.communityPins} />
	{#if geoData != null}
		<LeafletMap bind:filteredLocationList {queryMarker} />
	{/if}

	<footer
		id="dateSliderContainer"
		class={footerShowen ? 'show' : ''}
		on:mouseenter={showFooter}
		on:mouseleave={hideFooterDelay}
	>
		<button class="tab" on:click={toggleFooter}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-chevron-up"
				viewBox="0 0 16 16"
			>
				<path
					fill-rule="evenodd"
					d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
				/>
			</svg>
		</button>
		<h2>FILTERS</h2>
		<div class="inner">
			<h3>Filter by Date <span class="desktop-explanation">(when there was a infection)</span></h3>
			<DateSlider bind:dateRange={activeDateRange} bind:fullRange={fullActiveDateRange} id="active-range-slider" />
			<h3>Filter by date added <span class="desktop-explanation">(when it was discovered)</span></h3>
			<DateSlider bind:dateRange={addedDateRange} bind:fullRange={fullAddedDateRange} id="added-range-slider" />
		</div>
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
		padding: 0;
		background-color: white;
		transition: transform 100ms ease-out;
		transform: translateY(calc(87%));
		box-shadow: 2px 2px 10px rgb(75, 70, 70);


		.tab {
			position: absolute;
			text-align: center;
			top: -2rem;
			left: 50%;
			transform: translateX(-50%);
			background-color: #ffe330;
			color: #222222;
			border: none;
			padding: 0.5rem 2rem;
			border-radius: 5px 5px 0 0;
			font-weight: bolder;
			display: block;
			z-index: -1;
			box-shadow: 2px 2px 10px rgb(75, 70, 70);

		}
		.inner {
			transform: translateY(calc(100%));
			background-color: white;
		}

		h3 {
			text-align: center;
			font-size: 10pt;
			font-weight: 300;

			&:last-child {
				padding-top: 1em;
			}
		}
		h2 {
			color: white;
			text-align: center;
			font-size: 1.2em;
			font-weight: bold;
			padding: 0.4rem 0;
			margin: 0;
			background-color: #333333;
		}
	}
	.show {
		transform: translateY(0);
		& > .inner {
			transform: translateY(0);
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
