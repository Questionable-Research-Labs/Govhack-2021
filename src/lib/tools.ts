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

interface Array {
    equals(array: Array): boolean;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false, value: function(array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}});
