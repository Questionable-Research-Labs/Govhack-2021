<script lang="ts">
	import SvelteTable from 'svelte-table';

	import type { Feature, Properties } from '$lib/geoJsonResponse';

	export let filteredLocationList: [Feature, boolean][];
	let cleanedFilteredLocationList = [];

	$: cleanedFilteredLocationList = filteredLocationList
		.filter(([feature, bool]) => bool)
		.map(([feature, bool]) => feature.properties);
	let rows = [];
	$: rows = cleanedFilteredLocationList;
    if (0==1) {let _ = cleanedFilteredLocationList[0].dateAdded;}

	const columns = [
		{
			key: 'event',
			title: 'Name',
			value: (v: Properties) => v.event,
			sortable: true,
			headerClass: 'text-left'
		},
		{
			key: 'location',
			title: 'Location',
			value: (v: Properties) => v.location,
			sortable: true,
			headerClass: 'text-left'
		},

		{
			key: 'start',
			title: 'Start',
			value: (v: Properties) => v.start.toLocaleString(),
			sortable: true,
			headerClass: 'text-left'
		},
		{
			key: 'end',
			title: 'End',
			value: (v: Properties) => v.end.toLocaleString(),
			sortable: true,
			headerClass: 'text-left'
		},
		{
			key: 'event',
			title: 'Date Added',
			value: (v: Properties) => v.dateAdded.toLocaleString(),
			sortable: true,
			headerClass: 'text-left'
		}
	];
</script>

<main>
	<SvelteTable {columns} {rows} />
</main>

<style lang="scss">
	main {
	}
</style>
