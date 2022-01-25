<script lang="ts" context="module">
	function interpolate(a: number, b: number) {
		return (t: number) => Math.round(a + (b - a) * t);
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
	import type { Feature, Properties } from '$lib/loiData';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { storeMarker, getPopupData, getMarkerID } from '$lib/markerStore';
	import moment from 'moment';
	import type OverlappingMarkerSpiderfier from '../oms';
	import '../../css/leaflet.scss';
	import type Leaflet from 'leaflet';
	import { generatePopup } from '$lib/popupGen';

	let map: L.Map;
	let leaflet: typeof Leaflet;
	let renderedMarkersLayer: L.FeatureGroup;
	let markerIcon: L.Icon;
	let oms: OverlappingMarkerSpiderfier;

	export let filteredLocationList: [Feature, boolean][];
	export let queryMarker: string;

	function setMarkerState(markerLayer: L.Marker | undefined, enabled: boolean) {
		if (!markerLayer) return;
		console.log(markerLayer);
		let markerDom = markerLayer.getElement();
		if (!markerDom) return;
		if (enabled) {
			if (markerDom.style.display != 'block') {
				markerDom.style.display = 'block';
				markerLayer.setOpacity(1);
				oms.addMarker(markerLayer);
				// marker.bindPopup(getPopupData(leaflet.stamp(marker)));
			}
		} else {
			if (markerDom.style.display != 'none') {
				markerDom.style.display = 'none';
				markerLayer.setOpacity(0);
				oms.removeMarker(markerLayer);
			}
		}
	}

	

	// Called once when the geojson data is loaded
	// Should
	function loadMarkers() {
		let now = moment();
		if (typeof filteredLocationList !== 'undefined' || filteredLocationList !== null) {
			loiCount.set(filteredLocationList.length);
			let queryMarkerReference = undefined;
			for (let [feature, enabled] of filteredLocationList) {
				let marker = leaflet.marker(feature.location.coordinates, {
					title: feature.properties.eventName,
					icon: markerIcon
				});

				renderedMarkersLayer.addLayer(marker);
				oms.addMarker(marker);
				let popupHTML = generatePopup(feature);

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
				oms.addListener('click', function (marker: L.Marker, markerPos: L.LatLng) {
					popup.setContent(getPopupData(leaflet.stamp(marker)));
					popup.setLatLng(markerPos);
					map.openPopup(popup);
				});
				oms.addListener('spiderfy', function (markers: L.Marker[]) {
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
			let markerLayer = renderedMarkersLayer.getLayer(getMarkerID(featureID));
			setMarkerState(markerLayer as L.Marker, enabled);
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
