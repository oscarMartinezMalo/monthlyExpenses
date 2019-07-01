import { Component, OnInit } from '@angular/core';
// import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'walletExpenses';

  ngOnInit(): void {
    // firebase.initializeApp({
    //   apiKey: 'AIzaSyBNr4wf36iiaW6UIOA--6wtE2JEf_b_gEk',
    // authDomain: 'ng-wallet-expenses.firebaseapp.com',
    // databaseURL: 'https://ng-wallet-expenses.firebaseio.com',
    // projectId: 'ng-wallet-expenses',
    // storageBucket: 'ng-wallet-expenses.appspot.com',
    // messagingSenderId: '362399682271',
    // appId: '1:362399682271:web:9523f3410adce10c'
    // });

    // firebase.auth().onAuthStateChanged(firebaseUser => {
    //   if (firebaseUser) {
    //     console.log(firebaseUser);
    //   } else {
    //     console.log('Not logged in');
    //   }
    // });
  }

}
