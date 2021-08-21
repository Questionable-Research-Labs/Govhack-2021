<script context='module'>
	export function load({ error, status }) {
		return {
			props: {
				error: `${status}: ${error.message}`,
				status: status
			}
		};
	}
</script>

<script lang='ts'>
	export let error: string;
	export let status: number;
</script>

<div class='container'>
	<main>
		<header>
			<h1>Oh no</h1>
			<h2>Error {status}</h2>
		</header>

		<div class='error'>
			<p>There was an error: </p>
			<p>{error}</p>
			<p class='link'><a href='/'>Goto Home</a></p>
		</div>
	</main>
</div>

<style lang='scss'>
	.container {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
  main {
		font-weight: bolder;
    width: max-content;
    text-align: center;
    background-color: #ffe330;
		border-radius: 3px;
    header {
			h1 {
				font-size: 30pt;
			}
      h2 {
        font-size: 25pt;
      }
      background-color: #222222;
      color: #ffe330;
      padding: 2em;
    }

    .error {
      padding: 2em;
			p {
				font-size: 20pt;
			}
			.link {
				background-color: #222222;
				padding: 0.5em;
				a {
          color: #ffe330;
				}
				margin: 1em;
			}
    }
  }
</style>