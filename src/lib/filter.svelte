<script lang="ts">
    // This is a svelte file for the Auto Subscribe feature

    import { Writable, writable } from "svelte/store";
    import {Feature} from "$lib/geoJsonResponse";
    import { DateRange } from "$lib/markerStore";
    import fuzzysearch from "fuzzysearch-ts"
    import {timeFromMoment} from "$lib/tools";

    export let dateRange: Writable<[number, number]>;
    export let searchBox: Writable<string>;
    export let geoFeatures: Feature[];

    let filterCache: [[number,number],string];
    
    // This contains all entries, but as a tuple with the boolean saying if it matches or not
    export let filteredLocationList: Writable<[Feature,boolean][]> = writable([]);

    const filterList: ((feature: Feature)=>boolean)[]  = [
        TestDateRange,
        TestStringSearch
    ]

    function TestDateRange(feature: Feature): boolean {
            // Start of search range must be before or equal to LOI
            // AND
            // End of search range must be after or equal to LOI
            let searchRange = [timeFromMoment(feature.properties.start),timeFromMoment(feature.properties.end)];
            return Math.floor(searchRange[0]) <= $dateRange[1] && Math.floor(searchRange[1]) >= $dateRange[0];
    }

    function TestStringSearch(feature: Feature): boolean {
        return fuzzysearch(($searchBox).toLowerCase(),(feature.properties.location+feature.properties.event).toLowerCase())
    }

    function combineLogic (feature: Feature): boolean {
        return filterList.map(check => check(feature)).every(Boolean);
    }

    $: {
        // Svelte quite often fires updates when not needed
        if ([$dateRange,$searchBox]!==filterCache) {
            filterCache = [$dateRange,$searchBox];
            $filteredLocationList = geoFeatures.map((feature)=>[feature,combineLogic(feature)])
        } else {
            console.log("Using cache for filtered locations")
        }
    }
    

</script>
