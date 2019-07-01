import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

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
            switchMap(user => {
                if (user) {
                    user.getIdToken().then((token: string) => { this.token = token; });
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                } else {
                    this.token = null;
                    return of(null);
                }
            })
        );

    }

    googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        return this.oAuthLogin(provider);
    }

    oAuthLogin(provider) {
        return this.afAuth.auth.signInWithPopup(provider).
            then((credential) => {
                console.log('You just Signed ');
                this.router.navigate(['/expense']);
                this.updateUserData(credential.user);
            });
    }

    // Update data from Google and emailPass SignIN and SignUP
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

    // SignUP
    emailPasswordSignupUser(email: string, password: string) {
        this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then(credential => {
                console.log('You just Signed ');
                this.router.navigate(['/expense']);
                this.updateUserData(credential.user);
            }
            ).catch(
                error => {
                    console.log(error);
                }
            );
    }

    // LognIn
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
            this.token = null;
            // this.user =  of(null);
            this.router.navigate(['/signin']);
        }).catch((error) => {
            // An error happened.
        });
    }

}
