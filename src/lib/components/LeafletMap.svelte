<script lang="ts" context="module">
	function interpolate(a,b) {
		return (t) => Math.round(a+(b-a)*t)
	}

	export let loiCount = tweened(0, {
		duration: 400,
		easing: cubicOut,
		interpolate: interpolate
	});
</script>

<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { browser } from '$app/env';
	import type { Features, GeoData, Properties } from '$lib/geoJsonResponse';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import {
		timeFromMoment,
		StoreMarker,
		TestRange,
		dateRangeTimings,
		GetMarkers,
		GetPopupData
	} from '$lib/filteringStore';
	import moment from 'moment';

	export let geoData: GeoData;
	export let dateRange: [number, number];
	export let filteredPlaces: number[];


	let map;
	let leaflet;
	let markers;
	let markerIcon;

	/// The popup requires HTML in the form of a string,
	/// so this generates a table with a title of all the data.
	function generatePopup(dataTable: Properties, location: [number, number]): string {
		// Title
		let output = `<p>${dataTable.event}</p>`;

		// Start table
		output += '<table>';
		/// Templates a table row with a key value pair
		const tableLine = (key: string, value: string | Date) => {
			if (value !== null) {
				output += `<tr><td>${key}</td><td>${value}</td></tr>`;
			}
		};
		tableLine('City', dataTable.city);
		tableLine('Location', dataTable.location);
		if (dataTable.dateAdded.isValid()) {
			tableLine('Date Added', `${dataTable.dateAdded.format('YYYY-MM-D LT')}`);
		} else {
			tableLine('Date Added', 'Not specified');
		}
		tableLine('Advice', dataTable.advice);
		tableLine('Start', `${dataTable.start.format('YYYY-MM-D LT')}`);
		tableLine('End', `${dataTable.end.format('YYYY-MM-D LT')}`);

		// End table
		output += '</table>';

		// Add link to google maps
		output += `<p><a target='none' href='https://maps.google.com/maps?q=&layer=c&cbll=${location[0]},${location[1]}'>View in Google Streetview</a></p>`;
		return output;
	}

	function loadMarkers() {
		let now = moment();
		if (
			(typeof geoData !== 'undefined' || geoData !== null) &&
			typeof geoData.features !== 'undefined'
		) {
			loiCount.set(geoData?.features.length);
			for (let feature of geoData?.features) {
				let marker = leaflet.marker(feature.geometry.coordinates, {
					title: feature.properties.event,
					icon: markerIcon
				});
				marker.addTo(markers);
				let popupHTML = generatePopup(feature.properties, feature.geometry.coordinates);
				marker.bindPopup(popupHTML);

				// Color code the markers based on how recently they were added
				if (feature.properties.dateAdded.isValid()) {
					let deltaDateAdded = now.diff(feature.properties.dateAdded, 'days');
					switch (deltaDateAdded) {
						case 0:
							(marker.getElement() as HTMLElement).style.filter = 'hue-rotate(140deg)';
							break;
						case 1:
							(marker.getElement() as HTMLElement).style.filter = 'hue-rotate(50deg)';
							break;
					}
				}

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

			// Mirror of official icon, because of a bug in the icon image url discovery system in leaflet
			// This is just swaps out the icons inside the library for the ones in the static directory
			markerIcon = leaflet.icon({
				iconRetinaUrl: '/leafletIcons/marker-icon-2x.png',
				iconUrl: '/leafletIcons/marker-icon.png',
				shadowUrl: '/leafletIcons/marker-shadow.png',
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
				tooltipAnchor: [16, -28],
				shadowSize: [41, 41]
			});

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

		if (typeof map === 'undefined' || typeof markers == 'undefined') return;

		let markerList = GetMarkers();
		if (markerList.length == 0) {
			// Data hasn't been loaded yet, load it now
			console.log('Post loading markers');
			if (browser) {
				loadMarkers();
			}
		} else {
		}

		let totalShown = 0

		for (let i in markerList) {
			let marker = markerList[i];
			let markerInRange = TestRange(dateRange, marker);
			if (
				markerInRange === dateRangeTimings.invalid ||
				markerInRange === dateRangeTimings.outOfRange
			) {
				if (typeof markers.getLayer(marker) !== 'undefined') {
					markers.getLayer(marker).getElement().style.display = 'none';
					markers.getLayer(marker).setOpacity(0);
					markers.getLayer(marker).unbindPopup();
				} else {
					console.log("What? Marker doesn't exist apparently");
				}
			} else if (typeof filteredPlaces !== 'undefined' && !filteredPlaces.includes(parseInt(i))) {
				if (typeof markers.getLayer(marker) !== 'undefined') {
					markers.getLayer(marker).getElement().style.display = 'none';

					markers.getLayer(marker).setOpacity(0);
				} else {
					console.log("What? Marker doesn't exist apparently");
				}
			} else {
				if (typeof markers.getLayer(marker) !== 'undefined') {
					totalShown += 1;
					markers.getLayer(marker).getElement().style.display = 'block';
					markers.getLayer(marker).setOpacity(1);
					markers.getLayer(marker).bindPopup(GetPopupData(marker));
				} else {
					console.log("What? Marker doesn't exist apparently");
				}
			}
		}
		loiCount.set(totalShown);
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
		a {
			text-align: center;
			font-weight: bold;
			width: 100%;
		}

		tr:last-child {
			td {
				border: none;
			}
		}

		td {
			border-bottom: 1px rgba(0, 0, 0, 0.1) solid;
		}

		table {
			border-spacing: 0 0.5em;
			border-collapse: separate;
		}
	}
</style>
