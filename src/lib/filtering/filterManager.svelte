<script lang="ts" context="module">
</script>

<script lang="ts">
	// This is a svelte file for the Auto Subscribe feature
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	import type { Feature } from '$lib/loiData';
	import { timeFromMoment, compareCaches } from '$lib/tools';
	import { LoiData } from '$lib/loiData';

	export let activeDateRange: [number, number];
	export let addedDateRange: [number, number];
	export let fullAddedDateRange: [number, number];
	export let searchTerm: string;
	export let geoData: LoiData | null;

	async function updateGeoJSON() {
		// Retrieve main document
		let officialResponse = await (await fetch('https://api.integration.covid19.health.nz/locations/v1/current-locations-of-interest')).json()
		// let communityResponse = await (await fetch('https://raw.githubusercontent.com/Questionable-Research-Labs/TOI-Community/master/community.geojson.json')).json()
		geoData = new LoiData(officialResponse);

	}
	updateGeoJSON();

	// Tweened for a fancy animation on UI
	export const loiCount = tweened(0, {
		duration: 400,
		easing: cubicOut,
		interpolate: (a, b) => (t) => Math.round(a + (b - a) * t)
	});

	let filterCache: [[number, number], [number, number], string];

	// This contains all entries, but as a tuple with the boolean saying if it matches or not
	export let filteredLocationList: [Feature, boolean][] = [];

	const filterList: ((feature: Feature) => boolean)[] = [testActiveDateRange, testStringSearch, testDateAdded];

	function testActiveDateRange(feature: Feature): boolean {
		// Start of search range must be before or equal to LOI
		// AND
		// End of search range must be after or equal to LOI
		let searchRange = [timeFromMoment(feature.properties.start), timeFromMoment(feature.properties.end)];
		return Math.floor(searchRange[0]) <= activeDateRange[1] && Math.floor(searchRange[1]) >= activeDateRange[0];
	}

	function testStringSearch(feature: Feature): boolean {
		return (feature.location.address + ' ' + feature.properties.eventName)
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
	}

	function testDateAdded(feature: Feature): boolean {
		let includeUnknown = Math.round(addedDateRange[0]) === Math.round(fullAddedDateRange[0]);
		if (feature.properties.dateAdded.isValid()) {
			let addedDate = timeFromMoment(feature.properties.dateAdded);
			return Math.ceil(addedDateRange[0]) <= addedDate && Math.ceil(addedDateRange[1]) >= addedDate;
		} else {
			// The slider is including unknown dates
			return includeUnknown;
		}
	}

	function combineLogic(feature: Feature): boolean {
		return filterList.map((check) => check(feature)).every(Boolean);
	}

	$: {
		// Svelte quite often fires updates when not needed
		if (geoData !== null && !compareCaches(filterCache, [activeDateRange, addedDateRange, searchTerm])) {
			filterCache = [activeDateRange, addedDateRange, searchTerm];
			filteredLocationList = geoData.loi.map((feature: Feature) => [feature, combineLogic(feature)]);
			loiCount.set(filteredLocationList.map(([_, enabled]: [Feature, boolean]) => enabled).filter(Boolean).length);
		}
	}
</script>
