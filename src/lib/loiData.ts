// Moments a bit funky with typescript
import { Moment } from 'moment';
import moment from 'moment';
export class LoiData {
	loi: Feature[];
	communityPins: boolean;
	noLocationPins: number = 0;

	constructor(primarySource: any) {
		this.communityPins = false;

		let allFeatures = primarySource['items'];

		this.loi = allFeatures.map((e: any) => {

			let official: boolean = true
			if (typeof e['Official'] !== "undefined") {
				official = e['Official']
			}

			let locationAvailable = true;
			if (e['location']['latitude'] === "" || e['location']['longitude'] === "") {
				locationAvailable = false;
				this.noLocationPins += 1;
			}
			if (locationAvailable) {
				return {
					location: {
						coordinates: locationAvailable ? [parseFloat(e['location']['latitude']),parseFloat(e['location']['longitude'])] : null,
						address: e['location']['address'],
						suburb: e['location']['suburb'],
						city: e['location']['city'],
					},
					properties: {
						start: moment(e['startDateTime']),
						end: moment(e['endDateTime']),
						dateAdded: moment(e['publishedAt']),
						eventName: e['eventName'],
						publicAdvice: e['publicAdvice'],
						id: e['eventId'],
						updated: moment(e['updatedAt']),
						infoLink: e["link"],
						official,
						exposerType: ExposerType.fromString(e['exposureType']),
						visibleInWebform: e['visibleInWebform']
					},
					locationAvailable,
				};
			}

		}).filter(Boolean);
	}
}

export interface Feature {
	location: Location;
	properties: Properties;
	locationAvailable: boolean;
}

export interface Location {
	coordinates: [number,number],
	address: string,
	suburb: string,
	city: string,
}

export interface Properties {
	end: Moment;
	eventName: string;
	publicAdvice: string;
	start: Moment;
	id: string;
	dateAdded: Moment;
	updated: Moment;
	official: boolean;
	infoLink: string;
	exposerType: ExposerType;
	visibleInWebform: boolean;
}

export enum ExposerType {
	Casual = "Casual",
	CasualPlus = "Casual Plus",
	Close = "Close",
	Unknown = "Unknown",
}

export namespace ExposerType {
	export function toColor(type: ExposerType): string {
		switch (type) {
			case ExposerType.Casual:
				return "#4bc44b";
			case ExposerType.CasualPlus:
				return "#e6b72c";
			case ExposerType.Close:
				return "#d93d2b";
		}
		return "#e0e0e0";
	}

	export function fromString(type: string): ExposerType {
		switch (type) {
			case "Casual":
				return ExposerType.Casual;
			case "Casual Plus":
				return ExposerType.CasualPlus;
			case "Close":
				return ExposerType.Close;
		}
		return ExposerType.Unknown;
	}
}