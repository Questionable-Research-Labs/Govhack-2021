<script lang="ts">
    import {GeoData} from "$lib/geoJsonResponse";
    import {writable} from "svelte/store";
    import type {Writable} from "svelte/store";
    import {afterUpdate} from "svelte";

    export let geoData: GeoData | null;

    export let places = [];
    let probablePlaces = [];

    let searchCriteria: Writable<string> = writable("");

    searchCriteria.subscribe((searchCriteria) => {
        console.log(probablePlaces);
        places = probablePlaces.filter((e) => e.contains(searchCriteria));
        console.log(places);
    });

    afterUpdate(() => {
        if (geoData === null || typeof geoData === "undefined") return;
        console.log(geoData);
        for (let i = 0; i < geoData.features?.length; i++) {
            let feature = geoData.features[i];
            probablePlaces.push(i, feature.properties.event + ", " + feature.properties.event);
        }
    });
</script>

<div class="wrapper">
    <label>Address/Location
        <input type="text" bind:value={$searchCriteria}>
        <span></span>
    </label>
</div>

<style lang="scss">
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2em;
  }

  label {
    display: block;
  }

  input:required + span:after {
    content: "Required";
  }
</style>