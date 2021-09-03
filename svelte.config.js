import preprocess from 'svelte-preprocess';
import cloudflareAdapter from '@sveltejs/adapter-cloudflare-workers';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: cloudflareAdapter(),
		vite: {
			server: {
				hmr: { overlay: false }
			}
		}
	}
};

export default config;
