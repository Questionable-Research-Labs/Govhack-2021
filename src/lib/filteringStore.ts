import { MS_IN_DAY } from "$lib/consts";


type RelevantTimes = [number,number]

export enum dateRangeTimings {
    inRange,
    outOfRange,
    invalid
}

let markerStore: Map<number,RelevantTimes> = new Map();

export const timeFromMoment = (date: Date) => new Date(date).getTime() / MS_IN_DAY;


export function StoreMarker(times: RelevantTimes,leafletID: number) {
    markerStore[leafletID] = times
    // console.log(markerStore)
}

export function TestRange(dateRange: RelevantTimes,leafletID: number): dateRangeTimings {
    let relevantTimes = markerStore[leafletID];
    if (typeof relevantTimes !== "undefined") {

        return dateRange[0] < relevantTimes[0] && dateRange[1] > relevantTimes[1] ? dateRangeTimings.inRange : dateRangeTimings.outOfRange
    } else {
        console.log("Invalid Leaflet",leafletID)
        return dateRangeTimings.invalid
    }
}