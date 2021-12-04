// Moments a bit funky with typescript
import { Moment } from 'moment';
import moment from 'moment';
export class GeoData {
	loi: Feature[];
	communityPins: boolean;

	constructor(primarySource: object,communitySource: Object) {
		this.communityPins = communitySource['items'].length !==0;

		let allFeatures = [...primarySource['items'],...communitySource['items']];

		this.loi = allFeatures.map((e) => {

			let official: boolean = true
			if (typeof e['Official'] !== "undefined") {
				official = e['Official']
			}

			return {
				location: {
					latitude: parseFloat(e['location']['latitude']),
					longitude: parseFloat(e['location']['longitude']),
					address: e['Location']['address'],
					suburb: e['Location']['suburb'],
					city: e['Location']['city'],
				},
				properties: {
					start: moment(e['startDateTime']),
					end: moment(e['endDateTime']),
					dateAdded: moment(e['publishedAt']),
					eventName: e['eventName'],
					publicAdvice: e['publicAdvice'],
					eventId: e['eventId'],
					updated: moment(e['updatedAt']),
					infoLink: e["link"],
					official,
					exposerType: ExposerType[e['exposureType']],
				}
			} ;
		});
	}
}

export interface Feature {
	location: Location;
	properties: Properties;
}

export interface Location {
	latitude: number,
	longitude: number,
	address: string,
	suburb: string,
	city: string,
}

export interface Properties {
	end: Moment;
	event: string;
	advice: string;
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