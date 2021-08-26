<script lang="ts">
	import RangeSlider from 'svelte-range-slider-pips';
	import { onMount } from 'svelte';
	import { MS_IN_DAY } from '$lib/consts';
	import { formatDate, dateToString } from '$lib/tools';

	export let fullRange;
	export let id = 'range-slider';
	export let showAll = false;

	// How often the labels appear under the bar
	// Starts at 2, so it initializes with almost none,
	// but then fills the bar when we have data on screen
	// size.
	let numPipLabels = 2;
	$: pipStep = Math.round((fullRange[1] - fullRange[0]) / (numPipLabels - 2));

	export let dateRange;

	function pipFormatter(value: number, _ = undefined) {
		return value == fullRange[0] && showAll
			? 'All'
			: dateToString(value).split('-').slice(1, 3).join('-');
	}
	function handleFormatter(value: number, _ = undefined) {
		return dateToString(value);
	}

	onMount(() => {
		function updatePipNum() {
			// Magical line of best fit to produce good amount of PIP to
			// fit any given screen size
			let x =
				window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			numPipLabels = 0.007442 * x + 1.43;
		}
		window.addEventListener('resize', updatePipNum);
		updatePipNum();
	});
</script>

<div class="range-slider-wrapper">
	<RangeSlider
		bind:values={dateRange}
		min={fullRange[0]}
		max={fullRange[1]}
		pushy
		range
		float
		pips
		pipstep={pipStep}
		first="label"
		rest="label"
		formatter={pipFormatter}
		{handleFormatter}
		{id}
	/>
</div>

<style lang="scss">
	.range-slider-wrapper {
		/*		UNCOMMENT FOR YELLOW
    --range-handle: #ffe330;
    --range-handle-focus: #ffe330;
    --range-handle-border:   var(--range-handle);
    --range-range-inactive:  var(--range-handle-inactive);
    --range-range:           var(--range-handle-focus);
    --range-float-inactive:  var(--range-handle-inactive);
    --range-float:           var(--range-handle-focus);
    --range-float-text:      black; */
		max-width: 80%;
		width: 100%;
		margin: 0 auto;
	}
</style>
