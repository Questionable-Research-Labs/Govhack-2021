<script>
	import RangeSlider from 'svelte-range-slider-pips';
    import { browser } from '$app/env';
	import {MS_IN_DAY} from "$lib/consts";

	const full_range = [
		new Date('2021-07-10').getTime() / MS_IN_DAY,
		new Date().getTime() / MS_IN_DAY
	]
	
	// How often the labels appear under the bar
	const num_pip_labels = 12;
	const pip_step = Math.round((full_range[1]-full_range[0])/(num_pip_labels-2))
	console.log("Pip step:",pip_step)

	export let values = [
		new Date().getTime() / MS_IN_DAY - 20,
		new Date().getTime() / MS_IN_DAY
	];

	function displayDates(value, pip_index) {
		// return value
		return new Date(value * MS_IN_DAY).toISOString().split('T')[0];
	}
</script>

<RangeSlider
	bind:values
	min={full_range[0]}
	max={full_range[1]}
	pushy
	range
	float
	pips
	pipstep={pip_step}
	all="label"
	formatter={displayDates}
	handleFormatter={displayDates}
	class="range-slider"
/>

<style lang="scss">
	.range-slider {
		z-index: 1000;
	}
</style>
