<script lang="ts" context="module">


</script>

<script lang="ts">
    // This is a svelte file for the Auto Subscribe feature
    import { tweened } from "svelte/motion";
    import { cubicOut } from 'svelte/easing';

    import type { Feature } from "$lib/geoJsonResponse";
    import {timeFromMoment, compareCaches} from "$lib/tools";
    import {GeoData} from "$lib/geoJsonResponse";

    export let activeDateRange: [number, number];
    export let addedDateRange: [number, number];
    export let fullAddedDateRange: [number, number];
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

    export const loiCount = tweened(0, {
		duration: 400,
		easing: cubicOut,
		interpolate: (a,b)=>(t)=>Math.round(a+(b-a)*t)
	});


    let filterCache: [[number,number],[number,number],string];
    
    // This contains all entries, but as a tuple with the boolean saying if it matches or not
    export let filteredLocationList: [Feature,boolean][] = [];

    let dateAddedEnabled = false;

    const filterList: ((feature: Feature)=>boolean)[]  = [
        TestActiveDateRange,
        TestStringSearch,
        TestDateAdded
    ];



    function TestActiveDateRange(feature: Feature): boolean {
            // Start of search range must be before or equal to LOI
            // AND
            // End of search range must be after or equal to LOI
            let searchRange = [timeFromMoment(feature.properties.start),timeFromMoment(feature.properties.end)];
            return Math.floor(searchRange[0]) <= activeDateRange[1] && Math.floor(searchRange[1]) >= activeDateRange[0];
    }

    function TestStringSearch(feature: Feature): boolean {
        return (feature.properties.location+" "+feature.properties.event).toLowerCase().includes(searchTerm.toLowerCase())
    }

    function TestDateAdded(feature: Feature): boolean {
        if (Math.round(addedDateRange[0]) !== Math.round(fullAddedDateRange[0])) {
            let addedDate = timeFromMoment(feature.properties.dateAdded)
            return Math.floor(addedDateRange[0]) <= addedDate && Math.floor(addedDateRange[1]) >= addedDate;

        } else {
            // The slider is on the "All" position
            console.log(addedDateRange[0] !== fullAddedDateRange[0])
            return true
        }
    }


    function combineLogic (feature: Feature): boolean {
        return filterList.map(check => check(feature)).every(Boolean);
    }

    $: {
        // Svelte quite often fires updates when not needed
        if (geoData !== null && !compareCaches(filterCache,[activeDateRange,addedDateRange,searchTerm])) {
            console.log("Updating Filter")
            filterCache = [activeDateRange,addedDateRange,searchTerm];
            filteredLocationList = geoData.features.map((feature: Feature)=>[feature,combineLogic(feature)])
            loiCount.set(filteredLocationList.map(([_,enabled]: [Feature,boolean])=>enabled).filter(Boolean).length)
        } else {
            console.log("Skipping Update")
        }
    }
    

</script>
