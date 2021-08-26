<script lang="ts" context="module">


</script>

<script lang="ts">
    // This is a svelte file for the Auto Subscribe feature
    import { tweened } from "svelte/motion";
    import { cubicOut } from 'svelte/easing';

    import fuzzysearch from "fuzzysearch";

    import type {Feature} from "$lib/geoJsonResponse";
    import {timeFromMoment} from "$lib/tools";
    import {GeoData} from "$lib/geoJsonResponse";

    export let dateRange: [number, number];
    export let searchTerm: string;
    export let geoData: GeoData|null;
    async function updateGeoJSON() {
        fetch(
            'https://raw.githubusercontent.com/minhealthnz/nz-covid-data/main/locations-of-interest/august-2021/locations-of-interest.geojson'
        )
        .then((response) => response.json())
        .then((jsonData) => {
            geoData = new GeoData(jsonData);
        })
        .catch((error) => {
            console.error('Could not fetch data:', error);
        });
    }
    updateGeoJSON();

    let filterCache: [[number,number],string];
    
    // This contains all entries, but as a tuple with the boolean saying if it matches or not
    export let filteredLocationList: [Feature,boolean][] = [];

    export const loiCount = tweened(0, {
		duration: 400,
		easing: cubicOut,
		interpolate: (a,b)=>(t)=>Math.round(a+(b-a)*t)
	});

    const filterList: ((feature: Feature)=>boolean)[]  = [
        TestDateRange,
        TestStringSearch
    ];



    function TestDateRange(feature: Feature): boolean {
            // Start of search range must be before or equal to LOI
            // AND
            // End of search range must be after or equal to LOI
            let searchRange = [timeFromMoment(feature.properties.start),timeFromMoment(feature.properties.end)];
            return Math.floor(searchRange[0]) <= dateRange[1] && Math.floor(searchRange[1]) >= dateRange[0];
    }

    function TestStringSearch(feature: Feature): boolean {
        return fuzzysearch((searchTerm).toLowerCase(),(feature.properties.location+feature.properties.event).toLowerCase())
    }

    function combineLogic (feature: Feature): boolean {
        return filterList.map(check => check(feature)).every(Boolean);
    }

    function checkIfFilterCache() {
        if (typeof filterCache === "undefined") {
            return false
        }
        return dateRange[0]===filterCache[0][0] && dateRange[1]===filterCache[0][1] && searchTerm===filterCache[1]
    }

    $: {
        // Svelte quite often fires updates when not needed
        if (geoData !== null) {
            console.log("Updating Filter")
            filterCache = [dateRange,searchTerm];
            filteredLocationList = geoData.features.map((feature: Feature)=>[feature,combineLogic(feature)])
            loiCount.set(filteredLocationList.map(([_,enabled]: [Feature,boolean])=>enabled).filter(Boolean).length)
        } else {
            console.log("Skipping Update")
        }
    }
    

</script>
