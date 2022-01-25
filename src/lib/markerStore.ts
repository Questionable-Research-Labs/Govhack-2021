import { MS_IN_DAY } from '$lib/consts';

export type DateRange = [number, number];

export enum dateRangeTimings {
	inRange,
	outOfRange,
	invalid
}

let markerStore: Map<string, number> = new Map();
let popupDataStore: Map<number, string> = new Map();

export function storeMarker(featureID: string, leafletID: number, popupData: string) {
	markerStore.set(featureID, leafletID);
	popupDataStore.set(leafletID, popupData);
}

export function getMarkerID(featureID: string): number {
	return markerStore.get(featureID) || -1;
}

export function getMarkerIDs(): number[] {
	return Array.from([...Object.keys(markerStore)].map((x) => parseInt(x)));
}

export function getPopupData(leafletID: number): string {
	return popupDataStore.get(leafletID) || "";
}
