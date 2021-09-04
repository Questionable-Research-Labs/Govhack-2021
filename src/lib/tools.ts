import { MS_IN_DAY } from '$lib/consts';
import moment, { Moment } from 'moment';

export const formatDate = (date: Date): string =>
	date.toLocaleString('sv', { timeZone: 'Pacific/Auckland' }).split(' ')[0];

// Takes our custom date system and converts it into a human string
export function dateToString(value: number, _ = undefined): string {
	// return value
	return formatDate(new Date(Math.round(value * MS_IN_DAY)));
}

// Takes a date and converts it into our custom days since epoch date system
export const timeFromMoment = (date: Date | Moment) => {
	let utcTime;
	if (moment.isMoment(date)) {
		utcTime = date.valueOf();
	} else {
		utcTime = date.getTime();
	}
	return Math.round(utcTime / MS_IN_DAY);
};

// Thanks javascript for flawless equality
export function compareCaches(arrayA: any[], arrayB: any[]) {
	if (typeof arrayA === 'undefined' || typeof arrayB === 'undefined') {
		return false;
	}
	if (arrayA.length !== arrayB.length) {
		return false;
	}
	for (var i = 0, l = arrayA.length; i < l; i++) {
		// Check if we have nested arrays
		if (arrayA[i] instanceof Array && arrayB[i] instanceof Array) {
			// recurse into the nested arrays
			if (!compareCaches(arrayA[i], arrayB[i])) {
				return false;
			}
		} else if (arrayA[i] instanceof Number && arrayB[i] instanceof Number) {
			if (Math.round(arrayA[i]) != Math.round(arrayB[i])) {
				return false;
			}
		} else if (arrayA[i] != arrayB[i]) {
			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false;
		}
	}
	return true;
}
