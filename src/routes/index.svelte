<script>
	import { browser } from '$app/env';

	let pwa = false;

	if (browser) {
		const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
		if (document.referrer.startsWith('android-app://') || navigator.standalone || isStandalone) {
			window.location.href = '/map';
			pwa = true;
		}
	}
</script>

<svelte:head>
	<title>Toi | Times of Interest</title>
</svelte:head>

<main class='info'>
	<img class='info__icon' src='/icons/icon.svg' alt='Toi' width='128' height='128' />
	<h1 class='info__title'>Toi</h1>
	<h3 class='info__subtitle'>Times of Interest</h3>
	{#if !pwa}
		<a class='info__button' href='/map'>View the map</a>
		<section class='info__section'>
			<h4 class='info__section__title'>What is Toi?</h4>
			<p class='info__section__text'>
				<b>Toi</b> is an application that allows people to easily search <b>COVID-19</b>
				locations of interest between the specified dates. The website has a large easy to navigate map
				and a slider at the bottom of the webpage to slide through all the different dates and see what
				the locations of interest were.
			</p>
		</section>
		<section class='info__section'>
			<h4 class='info__section__title'>How do I use Toi?</h4>
			<p class='info__section__text'>
				To use <b>Toi</b> you must first navigate to <a href='/map'>Here</a> to view the map. At the bottom
				of the screen, there is a large slider with this slider you can adjust the two points to select
				your range of dates. The first point is the starting date and the second is the ending. After this
				blimps will appear on the map showcasing the locations of interest. You can also filter to only
				a specific location by using the search box at the top of your screen.
			</p>
		</section>

		<section class='info__section'>
			<h4 class='info__section__title'>Open Source</h4>
			<p class='info__section__text'>
				This is an open-source project! This means all of the code that went into this project is
				available to the public. If you are interested in contributing or would just like to view the
				code for this website you can view it on <a
				href='https://github.com/Questionable-Research-Labs/Govhack-2021'
				target='_blank'
				rel='noreferrer'>Github here</a
			>
			</p>
		</section>

		<a class='footnote' href='https://qrl.nz' rel='noreferrer'
		>This project was developed by the <b>Questionable Research Labs</b> Team</a
		>
	{:else}
		<p class='info__button'>Loading map</p>
	{/if}
</main>

<style lang='scss'>
  .info {
    text-align: center;
    padding: 1em;

    &__button {
      display: block;
      background-color: #333;
      padding: 1em;
      color: white;
      max-width: 200px;
      margin: 1em auto;
      text-decoration: none;
      font-weight: bold;
      letter-spacing: 0.1em;
    }

    &__title {
      margin-bottom: 0;
    }

    &__subtitle {
      color: gray;
      margin-top: 0.2em;
      margin-bottom: 2em;
    }

    &__section {
      display: block;
      max-width: 700px;
      width: 100%;
      margin: 2em auto;

      &__title {
        font-weight: bold;
        font-size: 1.1em;
        margin-bottom: 0.5em;
      }

      &__text {
        line-height: 1.5;
      }
    }
  }

  .footnote {
    margin-top: 5em;
    color: gray;
    text-decoration: none;
  }

  b {
    font-weight: bold;
  }
</style>
