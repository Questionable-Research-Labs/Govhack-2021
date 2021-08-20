<script lang="ts">
    import LeafletMap from "../lib/components/leaflet/LeafletMap.svelte";
    import {writable} from "svelte/store";

    let geoData = writable();

    fetch("https://raw.githubusercontent.com/minhealthnz/nz-covid-data/main/locations-of-interest/august-2021/locations-of-interest.geojson").then((response) =>
        response.json()
    ).then((jsonData) => {
        geoData.set(jsonData);
    }).catch((error) => {
        console.error("Could not fetch data:", error);
    });

</script>


<main>
    <h1>Would ya look at that</h1>
    <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
    <LeafletMap/>
</main>


<style lang="scss">
</style>