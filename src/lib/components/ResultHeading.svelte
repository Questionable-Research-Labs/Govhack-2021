<script lang='ts'>
	import { dateToString } from '$lib/tools';

	export let dates: [number, number];
</script>

{#if dates}
	<div class='results-info'>
		<h2 class='results-info__title'>Showing Results</h2>
		<div class='results-info__body'>
			<span class='results-info__body__marker'>From
				<span>{dateToString(dates[0])}</span>
			</span>
			<span class='results-info__body__marker'>To
				<span>{dateToString(dates[1])}</span>
			</span>
		</div>
	</div>
{/if}

<style lang='scss'>
  .results-info {
    text-align: center;
    display: block;
    padding: 1em;
    background-color: white;

    &__title {
      margin-top: 0;
      margin-bottom: 0.5em;
      text-align: center;
      color: black;
    }

    &__body {
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      text-align: center;
      grid-gap: 1em;

      &__marker {
        text-transform: uppercase;
        background-color: #ffe330;
        padding: 1em;
        color: black;
        font-weight: bold;

        > span {

        }
      }
    }

  }
</style>