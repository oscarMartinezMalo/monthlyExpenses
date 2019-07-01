// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase : {
    apiKey: 'AIzaSyBNr4wf36iiaW6UIOA--6wtE2JEf_b_gEk',
    authDomain: 'ng-wallet-expenses.firebaseapp.com',
    databaseURL: 'https://ng-wallet-expenses.firebaseio.com',
    projectId: 'ng-wallet-expenses',
    storageBucket: 'ng-wallet-expenses.appspot.com',
    messagingSenderId: '362399682271',
    appId: '1:362399682271:web:9523f3410adce10c'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
