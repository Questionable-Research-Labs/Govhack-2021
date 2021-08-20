<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/env';

    onMount(async () => {
        if(browser) {
            const leaflet = await import('leaflet');

            const map = leaflet.map('map').setView([-41, 174], 6);

            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            for (let i = 0; i < 10; i++) {
                leaflet.marker([Math.random()*-100,Math.random()*200]).addTo(map)
                    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.');
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
