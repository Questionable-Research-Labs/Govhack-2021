<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { browser } from '$app/env';
	import type { Features, GeoData, Properties } from '$lib/geoJsonResponse';
	import { MS_IN_DAY } from '$lib/consts';
	import {
		timeFromMoment,
		StoreMarker,
		TestRange,
		dateRangeTimings,
		GetMarkers,
		GetPopupData
	} from '$lib/filteringStore'

	export let geoData: GeoData;
	export let dateRange: [number, number];
	export let filteredPlaces: number[];

	let map;
	let leaflet;
	let markers;

	/// The popup requires HTML in the form of a string,
	/// so this generates a table with a title of all the data.
	function generatePopup(dataTable: Properties): string {
		// Title
		let output = `<p>${dataTable.event}</p>`;

		// Start table
		output += '<table>';
		/// Templates a table row with a key value pair
		const tableLine = (key: string, value: string|Date) => {
			if (value !== null) {
				output += `<tr><td>${key}</td><td>${value}</td></tr>`;
			}
		};
		tableLine('City', dataTable.city);
		tableLine('Location', dataTable.location);
		tableLine('Information', dataTable.information);
		tableLine('Start', `${dataTable.start.format('YYYY-MM-D LT')}`);
		tableLine('End', `${dataTable.end.format('YYYY-MM-D LT')}`);
		
		// End table
		output += "</table>"
		return output
	}

	function loadMarkers() {
		if (typeof geoData !== 'undefined') {
			for (let feature of geoData.features) {
				let marker = leaflet.marker(
					feature.geometry.coordinates,
					{
						title: feature.properties.event
					}
				);
				marker.addTo(markers);
				let popupHTML = generatePopup(feature.properties);
				marker.bindPopup(popupHTML);
				StoreMarker(
					[timeFromMoment(feature.properties.start), timeFromMoment(feature.properties.end)],
					leaflet.stamp(marker),
					popupHTML
				);
			}
		}
	}

	onMount(async () => {
		if (browser) {
			leaflet = await import('leaflet');

			markers = leaflet.layerGroup();
			const baseMap = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

		if (typeof map === 'undefined' || typeof markers == 'undefined') return;

		let markerList = GetMarkers();
		if (markerList.length == 0) {
			// Data hasn't been loaded yet, load it now
			console.log('Post loading markers');
			if (browser) {
				loadMarkers();
			}
		} else {
			console.log('found', markerList.length, 'markers');
		}

		console.log(markerList);

		for (let i in markerList) {
			let marker = markerList[i];
			let markerInRange = TestRange(dateRange, marker);
			console.log(markerInRange);
			if (
				markerInRange === dateRangeTimings.invalid ||
				markerInRange === dateRangeTimings.outOfRange
			) {
				if (typeof markers.getLayer(marker) !== 'undefined') {
					markers.getLayer(marker).setOpacity(0);
					markers.getLayer(marker).unbindPopup();
				} else {
					console.log("What? Marker doesn't exist apparently");
				}
			} else if (!filteredPlaces.includes(parseInt(i))) {
				if (typeof markers.getLayer(marker) !== 'undefined') {
					markers.getLayer(marker).setOpacity(0);
				} else {
					console.log("What? Marker doesn't exist apparently");
				}
			} else {
				if (typeof markers.getLayer(marker) !== 'undefined') {
					markers.getLayer(marker).setOpacity(1);
					markers.getLayer(marker).bindPopup(GetPopupData(marker));;

				} else {
					console.log("What? Marker doesn't exist apparently");
				}
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
		overflow: hidden;
		position: relative;
		height: 100vh;
		z-index: 0;
		#map {
			left: 0;
			top: 0;
			height: 100vh;
			min-width: 100%;
			position: absolute;
		}
	}

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
