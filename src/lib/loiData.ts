// Moments a bit funky with typescript
import { Moment } from 'moment';
import moment from 'moment';
export class LoiData {
	loi: Feature[];
	communityPins: boolean;

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
						exposerType: ExposerType[e['exposureType']],
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
}

export enum ExposerType {
	"casual",
	"casual plus",
	"close",
}