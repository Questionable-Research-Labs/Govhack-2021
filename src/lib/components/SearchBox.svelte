<script lang="ts">
    import {GeoData} from "$lib/geoJsonResponse";
    import {afterUpdate} from "svelte";
    import {Place} from "$lib/place";

    export let geoData: GeoData | null;
    export let probablePlaces: ((places: Place[]) => void);
    let places: Place[] = [];

    $: places = geoData?.features.map((feature, index) => new Place(index, feature.properties.event + ", " + feature.properties.location));

    let searchTerm = "";

    afterUpdate(() => {
        if (searchTerm === "") {
            probablePlaces(places);
        } else {
            probablePlaces(places.filter(place => place.location.toLowerCase().includes(searchTerm.toLowerCase())));
        }
    });
</script>

<div class="wrapper">
    <label>Address/Location
        <input type="text" bind:value={searchTerm}>
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