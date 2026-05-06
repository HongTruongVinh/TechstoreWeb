// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: false,
  //baseUrl: 'https://techstoreapi-35j6.onrender.com/api/',
  //urlUploadFile : 'https://techstoreapi-35j6.onrender.com/api/',
  baseUrl: 'https://localhost:7081/api/',
  urlUploadFile : 'https://localhost:7081/api/',
  imagesLink: 'https://res.cloudinary.com/dc8ijvcze/image/upload/v1747216196/',
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
