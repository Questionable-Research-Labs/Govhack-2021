<script lang="ts">
	import {afterUpdate, onMount} from 'svelte';
    import { browser } from '$app/env';
    import { GeoData } from "$lib/geoJsonResponse";
	import { timeFromMoment, StoreMarker, TestRange, dateRangeTimings } from "$lib/filteringStore";

    export let geoData: GeoData;
	export let dateRange: [number, number];

	let map;
	let leaflet;
	let markers;

	function loadMarkers() {
		if (typeof geoData !== 'undefined') {
			for (let feature of geoData.features) {
				let marker = leaflet.marker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
						title: feature.properties.event,
					});
				marker.addTo(markers)
                if (feature.properties.city !== null) {
					marker.bindPopup(`<p>${leaflet.stamp(marker)},  ${feature.properties.event}</p><table><tr><td>City</td><td>${feature.properties.city}</td></tr><tr><td>Location</td><td>${feature.properties.location}</td></tr><tr><td>Information</td><td>${feature.properties.information}</td></tr><tr><td>Start</td><td>${feature.properties.start.toLocaleString()}</td></tr><tr><td>End</td><td>${feature.properties.end.toLocaleString()}</td></tr></table>`);
				} else {

					marker.bindPopup(`<p>${leaflet.stamp(marker)},  ${feature.properties.event}</p><table><tr><td>Location</td><td>${feature.properties.location}</td></tr><tr><td>Information</td><td>${feature.properties.information}</td></tr><tr><td>Start</td><td>${feature.properties.start.toLocaleString()}</td></tr><tr><td>End</td><td>${feature.properties.end.toLocaleString()}</td></tr></table>`);
				}
				console.log("Marker: ",marker)
				StoreMarker([timeFromMoment(feature.properties.start),timeFromMoment(feature.properties.end)],leaflet.stamp(marker))
			}
		}
	}

	onMount(async () => {
        if(browser) {
            leaflet = await import('leaflet');

			markers = leaflet.layerGroup();
			const baseMap = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });
			if (typeof map === 'undefined') {
				map = leaflet.map('map', {
					center: [-41, 174],
					zoom: 6,
					layers: [baseMap, markers]
				});
				
			}
			loadMarkers();

        }
    });

	afterUpdate(async () => {
		// console.log("Updating");

		if (typeof map === "undefined" || typeof markers == "undefined") return;

		let markerList = markers.getLayers();
		if (markerList.length==0) {
			// Data hasn't been loaded yet, load it now
			console.log("Post loading markers")
			if (browser) {
				loadMarkers()
			}
			
		} else {
			console.log("found",markerList.length,"markers")
		}


		console.log(markerList)
		for (let marker of markerList) {
			let markerInRange = TestRange(dateRange,leaflet.stamp(marker));
			console.log(markerInRange);
			if (markerInRange === dateRangeTimings.invalid || markerInRange === dateRangeTimings.outOfRange) {
				if (typeof markers.getLayer(leaflet.stamp(marker)) !== "undefined") {
					markers.getLayer(leaflet.stamp(marker)).setOpacity(0.5);
				} else {
					console.log("What? Marker doesn't exist apparently")
				}
			} else {
				if (typeof markers.getLayer(leaflet.stamp(marker)) !== "undefined") {
					markers.getLayer(leaflet.stamp(marker)).setOpacity(1);
				} else {
					console.log("What? Marker doesn't exist apparently")
				}
			}
			
		}

		// for (let feature of filteredFeatures) {
		// 	console.log(dateRange[0], timeFromMoment(feature.properties.start), timeFromMoment(feature.properties.end), dateRange[1], dateRange[0] < timeFromMoment(feature.properties.start) && dateRange[1] > timeFromMoment(feature.properties.end));
		// 	if (feature.properties.city !== null) {
		// 		leaflet.marker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
		// 			title: feature.properties.event,
		// 		}).addTo(markers).bindPopup(`<p>${feature.properties.event}</p><table><tr><td>City</td><td>${feature.properties.city}</td></tr><tr><td>Location</td><td>${feature.properties.location}</td></tr><tr><td>Information</td><td>${feature.properties.information}</td></tr><tr><td>Start</td><td>${feature.properties.start.toLocaleString()}</td></tr><tr><td>End</td><td>${feature.properties.end.toLocaleString()}</td></tr></table>`);
		// 	} else {
		// 		leaflet.marker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
		// 			title: feature.properties.event,
		// 		}).addTo(markers).bindPopup(`<p>${feature.properties.event}</p><table><tr><td>Location</td><td>${feature.properties.location}</td></tr><tr><td>Information</td><td>${feature.properties.information}</td></tr><tr><td>Start</td><td>${feature.properties.start.toLocaleString()}</td></tr><tr><td>End</td><td>${feature.properties.end.toLocaleString()}</td></tr></table>`);
		// 	}
		// }

	});
</script>

<main>
	<div id="map-wrapper"><div id="map" /></div>
</main>

<style lang="scss">
	@import 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
	main #map-wrapper {
		overflow: hidden;
		padding-bottom: 70vh;
		position: relative;
		height: 0;
		z-index: 0;
		#map {
			left: 0;
			top: 0;
			height: 100%;
			width: 100%;
			position: absolute;
		}
	}
	@media (max-width: 480px) {
		main #map-wrapper {
			padding-bottom: 40vh;
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
