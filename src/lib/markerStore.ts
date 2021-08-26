import { MS_IN_DAY } from '$lib/consts';

export type DateRange = [number, number];

export enum dateRangeTimings {
	inRange,
	outOfRange,
	invalid
}

let markerStore: Map<string,number> = new Map();
let popupDataStore: Map<number,string> = new Map();



export function StoreMarker(featureID: string,leafletID: number, popupData: string) {
    markerStore[featureID] = leafletID;
    popupDataStore[leafletID] = popupData;
}

export function GetMarkerID(featureID: string): number {
	return markerStore[featureID]
}


export function GetMarkerIDs(): number[] {
	return Array.from([...Object.keys(markerStore)].map((x) => parseInt(x)));
}

export function GetPopupData(leafletID: number): string {
    return popupDataStore[leafletID]
}