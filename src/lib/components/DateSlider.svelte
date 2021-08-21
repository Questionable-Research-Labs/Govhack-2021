<script lang="ts">
	import RangeSlider from 'svelte-range-slider-pips';
    import { browser } from '$app/env';
	import {MS_IN_DAY} from "$lib/consts";
	import {formatDate,dateToString} from "$lib/tools"

	const full_range = [
		new Date('2021-07-30').getTime() / MS_IN_DAY,
		new Date().getTime() / MS_IN_DAY
	]

	
	// How often the labels appear under the bar
	const num_pip_labels = 12;
	const pip_step = Math.round((full_range[1]-full_range[0])/(num_pip_labels-2))

	export let dateRange = [
		new Date().getTime() / MS_IN_DAY - 20,
		Math.round( new Date().getTime() / MS_IN_DAY)
	];

	function pipFormatter(value: number, _ = undefined) {
		return dateToString(value).split("-").slice(1,3).join("-")
	}
	function handleFormatter(value: number, _ = undefined) {
		return dateToString(value)
	}
</script>
<div class="range-slider-wrapper">
	<RangeSlider
	bind:values={dateRange}
	min={full_range[0]}
	max={full_range[1]}
	pushy
	range
	float
	pips
	pipstep={pip_step}
	first="label"
	rest="label"
	formatter={pipFormatter}
	handleFormatter={handleFormatter}
	id="range-slider"
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
