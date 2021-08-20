<script>
	import RangeSlider from "svelte-range-slider-pips";
	export let values = [ new Date("2021-07-10").getTime()/86400000, new Date().getTime()/86400000];
	

	function displayDates(value,pip_index) {
		return new Date(value*86400000).toISOString().split("T")[0]
	}
  </script>

  <RangeSlider   bind:values min={new Date("2021-08-10").getTime()/86400000} max={new Date().getTime()/86400000} pushy range float pips  all="label" formatter={displayDates} handleFormatter={displayDates} springValues={{ stiffness: 0.5, damping: 0.5 }}/>
  <style lang="scss">

  </style>