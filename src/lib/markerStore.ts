import { MS_IN_DAY } from '$lib/consts';

export type DateRange = [number, number];

export enum dateRangeTimings {
	inRange,
	outOfRange,
	invalid
}

let markerStore: Map<number,DateRange> = new Map();
let popupDataStore: Map<number,string> = new Map();



export function StoreMarker(times: DateRange,leafletID: number, popupData: string) {
    markerStore[leafletID] = times;
    popupDataStore[leafletID] = popupData;
}


export function GetMarkers(): number[] {
	return Array.from([...Object.keys(markerStore)].map((x) => parseInt(x)));
}

export function GetPopupData(leafletID: number): string {
    return popupDataStore[leafletID]
}