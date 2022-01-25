// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig =
	import.meta.env['NODE_ENV'] === 'production'
		? {
				// PRODUCTION
				apiKey: "AIzaSyDzaTmgNuA7LV16iApCY5iUGrXkkOdIq4w",
				authDomain: "govhack-2021.firebaseapp.com",
				projectId: "govhack-2021",
				storageBucket: "govhack-2021.appspot.com",
				messagingSenderId: "1008594629792",
				appId: "1:1008594629792:web:7b7ea78a237d8fd26ec5c5",
				measurementId: "G-XN4QHHQRKJ"
		  }
		: {
				// DEV CONFIG
				apiKey: "AIzaSyDzaTmgNuA7LV16iApCY5iUGrXkkOdIq4w",
				authDomain: "govhack-2021.firebaseapp.com",
				projectId: "govhack-2021",
				storageBucket: "govhack-2021.appspot.com",
				messagingSenderId: "1008594629792",
				appId: "1:1008594629792:web:bd0b2cbcc54b92f76ec5c5",
				measurementId: "G-8MJQTXV2JT"
		  };

console.log('Configuring firebase app with ', firebaseConfig.appId);
