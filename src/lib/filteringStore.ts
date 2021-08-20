import { MS_IN_DAY } from "$lib/consts";


type RelevantTimes = [number,number]

let markerStore: Map<number,RelevantTimes> = new Map();

export const timeFromMoment = (date: Date) => new Date(date).getTime() / MS_IN_DAY;


export function StoreMarker(times: RelevantTimes,leafletID: number) {
    markerStore[leafletID] = times
    console.log("MarkerStore",markerStore)
}

export function TestRange(dateRange: RelevantTimes,leafletID: number): boolean | undefined {
    console.log(typeof leafletID)
    let relevantTimes = markerStore[leafletID];
    console.log(dateRange,relevantTimes,leafletID,(leafletID in markerStore))
    if (typeof relevantTimes !== "undefined") {

        return dateRange[0] < relevantTimes[0] && dateRange[1] > relevantTimes[1]
    } else {
        return undefined
    }
}