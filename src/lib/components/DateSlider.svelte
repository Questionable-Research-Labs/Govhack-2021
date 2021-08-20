<script>
	import RangeSlider from "svelte-range-slider-pips";
	export let values = [ new Date("2021-07-10").getTime(), new Date().getTime()];
	

	function displayDates(value,pip_index) {
		return new Date(value).toISOString().split("T")[0]
	}
  </script>

  <RangeSlider   bind:values min={new Date("2021-08-10").getTime()} max={new Date().getTime()} pushy range float pips step=86400000  all="label" formatter={displayDates} handleFormatter={displayDates}/>
  <style lang="scss">

  </style>