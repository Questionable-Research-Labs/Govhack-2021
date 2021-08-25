import { MS_IN_DAY } from '$lib/consts';
import moment, { Moment } from 'moment';


export const formatDate = (date: Date): string =>
	date
		.toLocaleString("sv", { timeZone: "Pacific/Auckland" })
		.split(" ")[0];

export function dateToString(value: number, _ = undefined): string {
	// return value
	return formatDate(new Date(value * MS_IN_DAY));
}
export const timeFromMoment = (date: Date | Moment) => {
	let utcTime;
	if (moment.isMoment(date)) {
		utcTime = date.valueOf();
	} else {
		utcTime = date.getTime();
	}
	return Math.round(utcTime / MS_IN_DAY);
};