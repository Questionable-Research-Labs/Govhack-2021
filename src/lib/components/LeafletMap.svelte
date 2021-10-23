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
	import InfoBlock from './InfoBlock.svelte';

	let map;
	let leaflet;
	let renderedMarkersLayer;
	let markerIcon;
	let oms: OverlappingMarkerSpiderfier;

	export let filteredLocationList: [Feature, boolean][];
	export let queryMarker: string;

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
		let output = "";
		if (!dataTable.official) {
			output += `
			<style>
				.leaflet-popup-content-wrapper {
					border-top: solid 5px #ffcc00;
					border-bottom: solid 5px #ffcc00;
				}
				.leaflet-container .leaflet-popup-close-button {
					top: 10px !important;
				}
			</style>
			`
		}

		// Share Button
		let copyPrompt = "Copy URL";
		let copiedPrompt = "Copied!";
		let shareURL = `window.location.href + '?marker=${dataTable.id}'`;
		let desktopButtonJS = `
			navigator.clipboard.writeText(${shareURL});
			var shareButton = document.getElementById('leaflet-popup-share-button');
			shareButton.ariaLabel='${copiedPrompt}';
			shareButton.addEventListener('mouseout', function( e ) {setTimeout(function() {e.target.ariaLabel = '${copyPrompt}'}, 300);});
		`;
		let mobileButtonJS = `
			navigator.share({
				title: 'toi.qrl.nz',
				text: '${dataTable.event} | Location of Interest:',
				url: ${shareURL},
			});
		`;
		let buttonJS = `
			if (navigator.share) {
				${mobileButtonJS}
			} else {
				${desktopButtonJS}
			}
		`;
		output += `
			<span class="leaflet-popup-share-button-wrapper">
				<button id="leaflet-popup-share-button" onclick="${buttonJS}" class="leaflet-container leaflet-popup-close-button leaflet-popup-share-button" aria-label="${copyPrompt}">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share-fill" viewBox="0 0 16 16">
						<path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
					</svg>
				</button>
			</span>
		`;

		// Title
		output += `<p>${dataTable.event}</p>`;

		// Start table
		output += '<table>';
		/// Templates a table row with a key value pair
		const tableLineGen = (key: string, value: string | Date) => {
			if (value !== null) {
				output += `<tr><td>${key}</td><td>${value}</td></tr>`;
			}
		};
		const linkGen = (link: string, text: string) => {
			output += `<a target='none' href='${link}''>${text}</a><br>`;
		};

		// Add table info
		tableLineGen('City', dataTable.city);
		tableLineGen('Location', dataTable.location);
		if (dataTable.dateAdded.isValid()) {
			tableLineGen('Date Added', `${dataTable.dateAdded.format('YYYY-MM-D LT')}`);
		} else {
			tableLineGen('Date Added', 'Not specified');
		}
		if (dataTable.updated.isValid()) {
			console.log('update', dataTable.event);
			tableLineGen('Updated', dataTable.updated.format('YYYY-MM-D LT'));
		}
		tableLineGen('Advice', dataTable.advice);
		tableLineGen('Start', `${dataTable.start.format('YYYY-MM-D LT')}`);
		tableLineGen('End', `${dataTable.end.format('YYYY-MM-D LT')}`);
		if (!dataTable.official) {
			tableLineGen('Status', 'Community Self Notification');
		}

		// End table
		output += '</table>';

		// Start link section
		output += '<p>';
		// More Info link (Used in community pins)
		if (typeof dataTable.infoLink !== 'undefined') {
			linkGen(dataTable.infoLink, 'View More Info');
		}
		// Add link to google maps
		linkGen('https://maps.google.com/maps?q=&layer=c&cbll=${location[0]},${location[1]}', 'View in Google Streetview');
		output += '</p>';
		return output;
	}

	// Called once when the geojson data is loaded
	// Should
	function loadMarkers() {
		let now = moment();
		if (typeof filteredLocationList !== 'undefined' || filteredLocationList !== null) {
			loiCount.set(filteredLocationList.length);
			let queryMarkerReference = undefined;
			for (let [feature, enabled] of filteredLocationList) {
				let marker = leaflet.marker(feature.geometry.coordinates, {
					title: feature.properties.event,
					icon: markerIcon
				});

				renderedMarkersLayer.addLayer(marker);
				oms.addMarker(marker);
				let popupHTML = generatePopup(feature.properties, feature.geometry.coordinates);

				storeMarker(feature.properties.id, leaflet.stamp(marker), popupHTML);
				
				if (feature.properties.id === queryMarker) {
					queryMarkerReference = marker;
					let popup = new leaflet.Popup({ offset: new leaflet.Point(0.5, -24) });
					popup.setContent(getPopupData(leaflet.stamp(marker)));
					popup.setLatLng(marker.getLatLng());
					map.openPopup(popup);
				}


				// If community pin, override colour
				if (!feature.properties.official) {
					let filter = `hue-rotate(${-156}deg) saturate(${200}%) brightness(1.4)`;
					(marker.getElement() as HTMLElement).style.filter = filter;
				} else {
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
			}
			if (typeof queryMarkerReference === "undefined") {
				if (typeof queryMarker !== "undefined") {
					console.log("Could not find marker")
				} else {
					console.log("Not searching for marker")
				}
				map.fitBounds(renderedMarkersLayer.getBounds());
			} else {
				console.log("Found marker!",queryMarkerReference.getLatLng())
				let marker_pos = JSON.parse(JSON.stringify(queryMarkerReference.getLatLng()))
				marker_pos.lat += 0.02
				map.setView(marker_pos, 13);
			}
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
