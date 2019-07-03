import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { PersoneExpense } from './persone-expense.model';

import { throwError, Subject, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, EMPTY } from 'rxjs';

export interface DropDownCategory {
    letter: string;
    names: string[];
}

@Injectable()
export class ExpenseService {

    rootUrl = 'https://ng-wallet-expenses.firebaseio.com/';

    private personalExp: PersoneExpense;
    // personeChage = new Subject<PersoneExpense>();
    // private personalExp: PersoneExpense = new PersoneExpense(
    //     2200, [
    //         new MonthlyExpense('Rent', 200),
    //         new MonthlyExpense('Nails', 150),
    //         new MonthlyExpense('Insurance', 75),
    //         new MonthlyExpense('Nails', 150),
    //         new MonthlyExpense('Insurance', 75),
    //         new MonthlyExpense('Nails', 150),
    //         new MonthlyExpense('Insurance', 75),
    //         new MonthlyExpense('Nails', 150),
    //         new MonthlyExpense('Insurance', 75)
    //     ]);

    private dropDownCategories: DropDownCategory[] = [{
        letter: 'C',
        names: ['Car Loan', 'Car Insurance', 'Car Gas', 'Car Toll', 'Car Parking', 'Car Maintenance', 'Car Appliances', 'Clothing']
    }, {
        letter: 'F',
        names: ['Food']
    }, {
        letter: 'G',
        names: ['Gifts']
    }, {
        letter: 'H',
        names: ['Households', 'Health Care']
    }, {
        letter: 'I',
        names: ['Internet']
    }, {
        letter: 'P',
        names: ['Power & Light', 'Phone Service', 'Phone payments', 'Personal hygiene']
    }, {
        letter: 'R',
        names: ['Rent', 'Restaurant']
    }, {
        letter: 'U',
        names: ['Uber, Lyft']
    }];

    items: Observable<any[]>;

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private db: AngularFireDatabase
    ) {
        // Use this for realtime data base
        // console.log('dd');
        // this.items = db.list('/userExpenses').valueChanges();
        // this.items.subscribe(resp => {
        //     console.log(resp);
        // });
    }

    getExpense() {

        const token = this.authService.token;

        return this.authService.user.pipe(
            switchMap(user => {
                if (user) {
                    return this.http.get<PersoneExpense>(this.rootUrl + `userExpenses/${user.uid}.json?auth=` + token)
                        .pipe(
                            map(response => {
                                return response;
                            }),
                            catchError((errorResponse: HttpErrorResponse) => {

                                let errorMessage;
                                if (errorResponse.error instanceof ErrorEvent) {
                                    // A client-side or network error occurred.
                                    errorMessage = `Error on your browser: ${errorResponse.error.message}`;

                                } else {
                                    // The backend returned an unsuccessful response code.
                                    errorMessage = errorResponse.error.message;
                                }

                                return throwError(errorMessage);
                            })
                        );
                } else {
                    return of(null);
                }

            }
            )
        );


    }

    getDrownDownCategory() {
        return this.dropDownCategories.slice();
    }


    storeExpenses(personeExpense: PersoneExpense) {

        const token = this.authService.token;
        return this.authService.user.pipe(
            switchMap(user => {
                // tslint:disable-next-line:max-line-length
                if (user) {
                    return this.http.put<PersoneExpense>(this.rootUrl + `userExpenses/${user.uid}.json?auth=` + token, personeExpense);
                } else {
                    return of(null);
                }
            }
            )
        );

    }

    deleteExpense(personeExpense: PersoneExpense) {
        // This should delete only the row affected but since the row dont have and ID the user data is all updated
        // return this.http.delete(this.rootUrl + `expenses/${user.uid}/expenses/${expenseRow}.json?auth=` + token);
        console.log(personeExpense);
        const token = this.authService.token;
        return this.authService.user.pipe(
            switchMap(user => {
                if (user) {
                    return this.http.put<PersoneExpense>(this.rootUrl + `userExpenses/${user.uid}.json?auth=` + token, personeExpense);
                } else {
                    return of(null);
                }
            })
        );
    }

}
