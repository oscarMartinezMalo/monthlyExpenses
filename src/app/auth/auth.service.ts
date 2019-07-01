import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface User {
    uid: string;
    email: string;
    photoUrl: string;
    displayName: string;
}

@Injectable()
export class AuthService {

    token: string;
    user: Observable<User>;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router) {

        this.user = this.afAuth.authState.pipe(
            switchMap(
                user => {
                    if (user) {
                        // user.getIdToken()
                        //     .then(
                        //         (token: string) => {
                        //             this.token = token;
                        //         }
                        //     );
                        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                    } else {
                        console.log('2');
                        return EMPTY;
                    }
                })
        );

        // afAuth.auth.onAuthStateChanged(firebaseUser => {
        //     // firebase.auth().onAuthStateChanged(firebaseUser => {
        //     if (firebaseUser) {

        //         this.userEmail = firebaseUser.email;

        //         firebaseUser.getIdToken()
        //             .then(
        //                 (token: string) => {
        //                     this.token = token;
        //                 }
        //             );

        //     } else {
        //         this.userEmail = null;
        //         this.token = null;
        //         console.log('Not logged in');
        //     }
        // });

    }

    googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        return this.oAuthLogin(provider);
    }

    oAuthLogin(provider) {
        return this.afAuth.auth.signInWithPopup(provider).
            then((credential) => {
                this.updateUserData(credential.user);
            });
    }

    updateUserData(user) {
        const userRef: AngularFirestoreDocument<User> = this.afs.doc<User>(`users/${user.uid}`);

        const data: User = {
            uid: user.uid,
            email: user.email,
            photoUrl: user.photoURL,
            displayName: user.displayName
        };
        return userRef.set(data);
    }

    emailPasswordSignupUser(email: string, password: string) {
        this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then(credential => {
                console.log('You just Signed ');
                this.updateUserData(credential.user);
            }
            ).catch(
                error => {
                    console.log(error);
                }
            );
    }

    emailPasswordSigninUser(email: string, password: string) {
        this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then(credential => {
                this.router.navigate(['/expense']);
                console.log('You just Logged-In');
                this.updateUserData(credential.user);
            }
            ).catch(
                error => {
                    console.log(error);
                }
            );
    }

    logOut() {
        this.afAuth.auth.signOut().then(() => {
            this.user = EMPTY;
            this.token = null;
            this.router.navigate(['/signin']);
        }).catch((error) => {
            // An error happened.
        });
    }

}
