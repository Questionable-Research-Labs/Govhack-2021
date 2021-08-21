<script lang='ts'>
	export let dates: [number, number];
</script>

{#if dates}
	<div class='results-info'>
		<h1 class='results-info__title'>Showing Results</h1>
		<div class='results-info__body'>
			<span class='results-info__body__marker'>From {Math.round(dates[0])}</span>
			<span class='results-info__body__marker'>To {Math.round(dates[1])}</span>
		</div>
	</div>
{/if}

<style lang='scss'>
	.results-info {
		display: block;

		&__title {
			text-align: center;
		}


	}
</style>