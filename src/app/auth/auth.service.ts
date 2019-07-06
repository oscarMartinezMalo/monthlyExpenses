import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

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
        private router: Router,
        private snackBar: MatSnackBar) {

        this.user = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    user.getIdToken().then((token: string) => { this.token = token; });
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                } else {
                    this.token = null;
                    // this.displayMessaggeSnackBar('Sign In Please', 'X');
                    return of(null);
                }
            })
        );

    }

    googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        return this.oAuthLogin(provider);
    }

    facebookLogin() {
        const provider = new firebase.auth.FacebookAuthProvider();
        return this.oAuthLogin(provider);
    }

    oAuthLogin(provider) {
        return this.afAuth.auth.signInWithPopup(provider).
            then((credential) => {
                // this.displayMessaggeSnackBar('You just Signed In', 'X');
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
                // this.displayMessaggeSnackBar('You just Signed Up', 'X');
                // this.router.navigate(['/expense']);
                // this.updateUserData(credential.user);

                // Verfication email
                this.sendVerificationEmail();
            }).catch(
                error => {
                    this.displayMessaggeSnackBar(error.message, error.code);
                }
            );
    }

    sendVerificationEmail() {
        const user = this.afAuth.auth.currentUser;
        user.sendEmailVerification().then(() => {
            this.displayMessaggeSnackBar('Please confirm account, an Email was sent to you', 'X');
        }).catch((error) => {
            this.displayMessaggeSnackBar(error.message, 'X');
        });
    }

    // LognIn
    emailPasswordSigninUser(email: string, password: string) {

        this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then(credential => {
                // Email verification
                if (credential.user.emailVerified) {
                    this.router.navigate(['/expense']);
                    // this.displayMessaggeSnackBar('You just logged in', 'X');
                    this.updateUserData(credential.user);
                } else {
                    this.displayMessaggeSnackBar('Please validate your email address. Check your inbox', 'X');
                }
            }
            ).catch(
                error => {
                    this.displayMessaggeSnackBar(error.message, error.code);
                }
            );
    }

    logOut() {
        this.afAuth.auth.signOut().then(() => {
            this.token = null;
            this.router.navigate(['/signin']);
        }).catch((error) => {
            this.displayMessaggeSnackBar(error.message, error.code);
        });
    }

    sendResetEmail(emailAddress: string) {

        this.afAuth.auth.sendPasswordResetEmail(emailAddress).then(() => {
            this.displayMessaggeSnackBar('An email was sent to you', 'X');
            this.router.navigate(['/signin']);
        }).catch((error) => {
            this.displayMessaggeSnackBar(error.message, 'X');
        });
    }

    displayMessaggeSnackBar(message: string, code: string) {
        this.snackBar.open(message, code, {
            duration: 3000,
        });
    }




}
