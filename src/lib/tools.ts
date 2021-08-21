import { MS_IN_DAY } from '$lib/consts';

export const formatDate = (date: Date): string =>
	date
		.toLocaleString("sv", { timeZone: "Pacific/Auckland" })
		.split(" ")[0];

export function dateToString(value: number, _ = undefined): string {
	// return value
	return formatDate(new Date(value * MS_IN_DAY));
}