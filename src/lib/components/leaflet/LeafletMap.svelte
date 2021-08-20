<script lang="ts">
	import {afterUpdate, onMount} from 'svelte';
    import { browser } from '$app/env';
    import { GeoData } from "$lib/geoJsonResponse";
	import {MS_IN_DAY} from "$lib/consts";

    export let geoData: GeoData;
	export let filterValues: [number, number];

	let map;
	let markers;

	const timeFromMoment = (date) => new Date(date.toDate()).getTime() / MS_IN_DAY;

	onMount(async () => {
        if(browser) {
            const leaflet = await import('leaflet');

			markers = leaflet.layerGroup();

			map = leaflet.map('map').setView([-41, 174], 6);
            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);


			for (let feature of geoData.features) {
				console.log(filterValues[0], filterValues[1], filterValues[0] < timeFromMoment(feature.properties.start) && filterValues[1] > timeFromMoment(feature.properties.end));
                if (feature.properties.city !== null) {
					leaflet.marker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
						title: feature.properties.event,
					}).addTo(markers).bindPopup(`<p>${feature.properties.event}</p><table><tr><td>City</td><td>${feature.properties.city}</td></tr><tr><td>Location</td><td>${feature.properties.location}</td></tr><tr><td>Information</td><td>${feature.properties.information}</td></tr><tr><td>Start</td><td>${feature.properties.start.toLocaleString()}</td></tr><tr><td>End</td><td>${feature.properties.end.toLocaleString()}</td></tr></table>`);
				} else {
					leaflet.marker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
						title: feature.properties.event,
					}).addTo(markers).bindPopup(`<p>${feature.properties.event}</p><table><tr><td>Location</td><td>${feature.properties.location}</td></tr><tr><td>Information</td><td>${feature.properties.information}</td></tr><tr><td>Start</td><td>${feature.properties.start.toLocaleString()}</td></tr><tr><td>End</td><td>${feature.properties.end.toLocaleString()}</td></tr></table>`);
				}
            }
        }
    });

	afterUpdate(async () => {
		console.log("Updating");
		const leaflet = await import('leaflet');

		if (typeof map === "undefined" || typeof markers == "undefined") return;

		markers.clearLayers();

		for (let feature of geoData.features.filter((e) => filterValues[0] < timeFromMoment(e.properties.start) && filterValues[1] > timeFromMoment(e.properties.end))) {
			console.log(filterValues[0], timeFromMoment(feature.properties.start), timeFromMoment(feature.properties.end), filterValues[1], filterValues[0] < timeFromMoment(feature.properties.start) && filterValues[1] > timeFromMoment(feature.properties.end));
			if (feature.properties.city !== null) {
				leaflet.marker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
					title: feature.properties.event,
				}).addTo(markers).bindPopup(`<p>${feature.properties.event}</p><table><tr><td>City</td><td>${feature.properties.city}</td></tr><tr><td>Location</td><td>${feature.properties.location}</td></tr><tr><td>Information</td><td>${feature.properties.information}</td></tr><tr><td>Start</td><td>${feature.properties.start.toLocaleString()}</td></tr><tr><td>End</td><td>${feature.properties.end.toLocaleString()}</td></tr></table>`);
			} else {
				leaflet.marker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
					title: feature.properties.event,
				}).addTo(markers).bindPopup(`<p>${feature.properties.event}</p><table><tr><td>Location</td><td>${feature.properties.location}</td></tr><tr><td>Information</td><td>${feature.properties.information}</td></tr><tr><td>Start</td><td>${feature.properties.start.toLocaleString()}</td></tr><tr><td>End</td><td>${feature.properties.end.toLocaleString()}</td></tr></table>`);
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
        z-index: 0;
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

    :global .leaflet-popup-content {
      p {
        font-weight: bold;
        text-align: center;
        width: 100%;
      }
        td:first-child {
          font-weight: bold;
          padding-right: 0.5em;
        }
    }
</style>
