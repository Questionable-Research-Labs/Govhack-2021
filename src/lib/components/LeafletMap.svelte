<script lang="ts" context="module">
	function interpolate(a, b) {
		return (t) => Math.round(a + (b - a) * t);
	}

	export const loiCount = tweened(0, {
		duration: 400,
		easing: cubicOut,
		interpolate: interpolate
	});
</script>

<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { browser } from '$app/env';
	import type { Feature, GeoData, Properties } from '$lib/geoJsonResponse';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { storeMarker, dateRangeTimings, getPopupData, getMarkerID } from '$lib/markerStore';
	import moment from 'moment';
	import type OverlappingMarkerSpiderfier from '../oms';

	let map;
	let leaflet;
	let renderedMarkersLayer;
	let markerIcon;
	let oms: OverlappingMarkerSpiderfier;

	export let filteredLocationList: [Feature, boolean][];

	function setMarkerState(marker, enabled: boolean) {
		if (enabled) {
			if (marker.getElement().style.display != 'block') {
				marker.getElement().style.display = 'block';
				marker.setOpacity(1);
				oms.addMarker(marker);
				// marker.bindPopup(getPopupData(leaflet.stamp(marker)));
			}
		} else {
			if (marker.getElement().style.display != 'none') {
				marker.getElement().style.display = 'none';
				marker.setOpacity(0);
				oms.removeMarker(marker);
			}
		}
	}

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

	// Called once when the geojson data is loaded
	// Should
	function loadMarkers() {
		let now = moment();
		if (typeof filteredLocationList !== 'undefined' || filteredLocationList !== null) {
			loiCount.set(filteredLocationList.length);
			for (let [feature, enabled] of filteredLocationList) {
				let marker = leaflet.marker(feature.geometry.coordinates, {
					title: feature.properties.event,
					icon: markerIcon
				});

				renderedMarkersLayer.addLayer(marker);
				oms.addMarker(marker);
				let popupHTML = generatePopup(feature.properties, feature.geometry.coordinates);

				storeMarker(feature.properties.id, leaflet.stamp(marker), popupHTML);

				// setMarkerState(marker, enabled);

				// Color code the markers based on how recently they were added
				if (feature.properties.dateAdded.isValid()) {
					let deltaDateAdded = now.startOf('day').diff(feature.properties.dateAdded.startOf('day'), 'days');

					// Use HSL to Transition #237CC9 (blue marker) to full #f72f2f (red)
					let hueRotateAmount = Math.max(-48 * deltaDateAdded + 148, 0);
					let saturationAmount = Math.max(8 * deltaDateAdded + 93, 70);

					let filter = `hue-rotate(${hueRotateAmount}deg) saturate(${saturationAmount}%)`;

					(marker.getElement() as HTMLElement).style.filter = filter;
				} else {
					let saturationAmount = 20;

					let filter = `saturate(${saturationAmount}%)`;

					(marker.getElement() as HTMLElement).style.filter = filter;
				}
			}
			map.fitBounds(renderedMarkersLayer.getBounds());
		}
	}

	onMount(async () => {
		if (browser) {
			leaflet = await import('leaflet');
			let OverlappingMarkerSpiderfier = await (await import('../oms')).default;

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

			renderedMarkersLayer = leaflet.featureGroup();

			// If changing the base map, remember to change the service worker caching to exclude the new domain
			const baseMap = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			});

			if (typeof map === 'undefined') {
				map = leaflet.map('map', {
					center: [-41, 174], //baseline zoom and location, updates on marker load
					zoom: 6,
					layers: [baseMap, renderedMarkersLayer]
				});

				// maximum brainage to work with old library
				oms = new OverlappingMarkerSpiderfier(map, leaflet, {});

				let popup = new leaflet.Popup({ offset: new leaflet.Point(0.5, -24) });
				oms.addListener('click', function (marker, markerPos) {
					console.log('Marker Clicked', marker);
					popup.setContent(getPopupData(leaflet.stamp(marker)));
					popup.setLatLng(markerPos);
					map.openPopup(popup);
				});
				oms.addListener('spiderfy', function (markers) {
					map.closePopup();
				});
			}
			loadMarkers();
		}
	});

	afterUpdate(async () => {
		if (typeof map === 'undefined' || typeof renderedMarkersLayer == 'undefined') return;

		for (let [feature, enabled] of filteredLocationList) {
			let featureID = feature.properties.id;
			let marker = renderedMarkersLayer.getLayer(getMarkerID(featureID));
			setMarkerState(marker, enabled);
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
