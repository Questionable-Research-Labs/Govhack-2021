<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import { writable } from 'svelte/store';

	onMount(async () => {
		if (browser) {
			let geoData = writable();
			geoData.subscribe((value) => {
				console.log(value);
			});

			const leaflet = await import('leaflet');

			const map = leaflet.map('map').setView([-41, 174], 6);

			leaflet
				.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution:
						'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				})
				.addTo(map);

			for (let i = 0; i < 10; i++) {
				leaflet
					.marker([-36.90733,  174.733646])
					.addTo(map)
					.bindPopup('A pretty CSS3 popup.<br> Easily customizable.');
			}
		}
	});
</script>

<main>
	<div id="map-wrapper"><div id="map" /></div>
</main>

<style lang="scss">
	@import 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
	main #map-wrapper {
        overflow:hidden;
        padding-bottom:70vh;
        position:relative;
        height:0;
		#map {
			left:0;
            top:0;
            height:100%;
            width:100%;
            position:absolute;
		}
	}
    @media (max-width: 480px) {
        main #map-wrapper {
            padding-bottom:40vh;
        }
    }
    // @media (min-width: 481px) and (max-width: 768px) {
    //     main #map-wrapper {
    //         padding-bottom:80%;
    //     }

    // }
</style>
