import { MS_IN_DAY } from "$lib/consts";
import moment, {isMoment, Moment} from 'moment'


type RelevantTimes = [number,number]

export enum dateRangeTimings {
    inRange,
    outOfRange,
    invalid
}

let markerStore: Map<number,RelevantTimes> = new Map();

export const timeFromMoment = (date: Date|Moment) => {
    let utcTime;
    if (isMoment(date)) {
        utcTime = date.valueOf();
    } else {
        utcTime = date.getTime();
    }
    return Math.round( utcTime / MS_IN_DAY)
};



export function StoreMarker(times: RelevantTimes,leafletID: number) {
    markerStore[leafletID] = times
}

export function TestRange(dateRange: RelevantTimes,leafletID: number): dateRangeTimings {
    let relevantTimes = markerStore[leafletID];
    
    if (typeof relevantTimes !== "undefined") {
        let startTimeInRange = dateRange[0] <= relevantTimes[0] && dateRange[1] >= relevantTimes[0]
        let endTimeInRange = dateRange[0] <= relevantTimes[1] && dateRange[1] >= relevantTimes[1]


        return startTimeInRange || endTimeInRange ? dateRangeTimings.inRange : dateRangeTimings.outOfRange
    } else {
        console.log("Invalid Leaflet",leafletID)
        return dateRangeTimings.invalid
    }
}

export function GetMarkers(): number[] {
    return Array.from([ ...Object.keys(markerStore) ].map(x=>parseInt(x)))
}