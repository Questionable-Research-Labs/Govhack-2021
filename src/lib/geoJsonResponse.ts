// Moments a bit funky with typescript
import { Moment } from 'moment';
import moment from 'moment';
export class GeoData {
	name: string;
	type: string;
	features: Feature[];

	constructor(primarySource: object,communitySource: Object) {
		this.name = primarySource['name'];
		this.type = primarySource['type'];
		let allFeatures = [...primarySource['features'],...communitySource['features']]
		this.features = allFeatures.map((e) => {
			let dateAdded: Moment;
			if (e['properties']['Added'].includes('-')) {
				dateAdded = moment(e['properties']['Added'], 'YYYY-MM-DD HH:mm:ss');
			} else {
				dateAdded = moment(e['properties']['Added'], 'DD/MM/YYYY h:mm');
			}
			let official: boolean = true
			if (typeof e['properties']['official'] !== "undefined") {
				official = e['properties']['official']
			}

			return {
				geometry: {
					...e['geometry'],
					coordinates: [parseFloat(e['geometry']['coordinates'][1]), parseFloat(e['geometry']['coordinates'][0])]
				},
				type: e['type'],
				properties: {
					start: moment(e['properties']['Start'], 'DD/MM/YYYY hh:mm a'),
					end: moment(e['properties']['End'], 'DD/MM/YYYY hh:mm a'),
					dateAdded,
					city: e['properties']['City'],
					event: e['properties']['Event'],
					advice: e['properties']['Advice'],
					location: e['properties']['Location'],
					id: e['properties']['id'],
					updated: moment(e['properties']['Updated'], 'DD/MM/YYYY hh:mm a'),
					official: official
				}
			};
		});
	}
}

export interface Feature {
	geometry: Geometry;
	properties: Properties;
	type: string;
}

export interface Geometry {
	coordinates: [number, number];
	type: string;
}

export interface Properties {
	city: string;
	end: Moment;
	event: string;
	advice: string;
	location: string;
	start: Moment;
	id: string;
	dateAdded: Moment;
	updated: Moment;
	official: boolean;
}
