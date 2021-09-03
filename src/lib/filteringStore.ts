import { MS_IN_DAY } from '$lib/consts';
import moment, { Moment } from 'moment';

type RelevantTimes = [number, number];

export enum dateRangeTimings {
	InRange,
	OutOfRange,
	Invalid
}

let markerStore: Map<number, RelevantTimes> = new Map();
let popupDataStore: Map<number, string> = new Map();

export function StoreMarker(activeTimes: RelevantTimes, addedTime: number, leafletID: number, popupData: string) {
	markerStore[leafletID] = {
		activeTimes,
		addedTime
	};
	popupDataStore[leafletID] = popupData;
}

export function getMarkers(): number[] {
	return Array.from([...Object.keys(markerStore)].map((x) => parseInt(x)));
}

export function getPopupData(leafletID: number): string {
	return popupDataStore[leafletID];
}
