<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/env';
    import { GeoData } from "../../geoJsonResponse";

    export let geoData: GeoData;

    onMount(async () => {
        if(browser) {
            const leaflet = await import('leaflet');


			const map = leaflet.map('map').setView([-41, 174], 6);

            for (let feature of geoData.features) {
                console.log(feature);
                leaflet.marker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
                    title: feature.properties.event,
                }).addTo(map)
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
