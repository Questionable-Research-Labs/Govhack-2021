<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/env';
    import {GeoData} from "$lib/geoJsonResponse";

    export let geoData: GeoData;

    onMount(async () => {
        if(browser) {
            const leaflet = await import('leaflet');

            const map = leaflet.map('map').setView([-41, 174], 6);

            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

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
    <div id="map"></div>
</main>

<style>
    @import 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    main #map {
        height: 800px;
    }
</style>
