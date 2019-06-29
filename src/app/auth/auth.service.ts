import * as firebase from 'firebase';

import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

interface User {
    uid: string;
    email: string;
    photoUrl: string;
    displayName: string;
}

@Injectable()
export class AuthService {

    token: string;
    userEmail: string;
    user: Observable<User>;

    constructor(
        // private afAuth: AngularFireAuth,
        // private afs: AngularFirestore,
        private router: Router) {

        // this.user = this.afAuth.authState.lift(
        //     user => {
        //         if (user) {
        //             return this.afs.doc<User>(`user/${user.uid}`).valueChanges();
        //         } else {
        //             return Observable;
        //         }
        //     }
        // );

        firebase.initializeApp({
            apiKey: 'AIzaSyBNr4wf36iiaW6UIOA--6wtE2JEf_b_gEk',
            authDomain: 'ng-wallet-expenses.firebaseapp.com',
        });

        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                console.log(firebaseUser.email);
                this.userEmail = firebaseUser.email;

                firebaseUser.getIdToken()
                    .then(
                        (token: string) => {
                            this.token = token;
                        }
                    );

            } else {
                this.userEmail = null;
                this.token = null;
                console.log('Not logged in');
            }
        });

    }

    googleLogin() {
        // this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        // const provider = new firebase.auth.GoogleAuthProvider();
        // return this.oAuthLogin(provider);
    }

    oAuthLogin(provider) {
        // return this.afAuth.auth().signInWithPopup(provider).
        //     then((credential) => {
        //         this.updateUserData(credential.user);
        //     });
    }

    updateUserData(user) {
        // const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

        // const data: User = {
        //     uid: user.uid,
        //     email: user.email,
        //     photoUrl: user.photoURL,
        //     displayName: user.displayName
        // };

        // return userRef.set(data);
    }

    signupUser(email: string, password: string) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(
                response => {
                    this.router.navigate(['/expense']);
                    console.log('You just Signed ');
                }
            ).catch(
                error => {
                    console.log(error);
                }
            );
    }

    signinUser(email: string, password: string) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(
                response => {
                    this.router.navigate(['/expense']);
                    console.log('You just Logged-In');
                }
            ).catch(
                error => {
                    console.log(error);
                }
            );
    }

    logOut() {
        firebase.auth().signOut();
        // this.router.navigate(['/signin']);
    }

    getToken() {
        return this.token;
    }

    getUserEmail() {
        return this.userEmail;
    }

    isAuthenticated() {
        return (this.userEmail != null && this.token != null);
    }

}
