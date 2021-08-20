<script>
	import RangeSlider from "svelte-range-slider-pips";
	let values = [ new Date("2021-08-10").getTime(), new Date().getTime()];

	function displayDates(value,pip_index) {
		return new Date(value).toISOString().split("T")[0]
	}

  </script>

  <RangeSlider   bind:values min={new Date("2021-08-10").getTime()} max={new Date().getTime()} pushy range float pips all="label" handleFormatter={displayDates}/>
  <style lang="scss">

  </style>