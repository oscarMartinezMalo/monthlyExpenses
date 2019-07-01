import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PersoneExpense } from './persone-expense.model';
import { MonthlyExpense } from './monthly-expense.component';

import { throwError, Subject, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

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

    constructor(private http: HttpClient, private authService: AuthService) { }

    getExpense() {
        // return this.personalExp;
        const token = this.authService.token;

        return this.authService.user.pipe(
            switchMap(user => {
                if (user) {
                    return this.http.get<PersoneExpense>(this.rootUrl + `expenses/${user.uid}.json?auth=` + token)
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
                    return this.http.put<PersoneExpense>(this.rootUrl + `expenses/${user.uid}.json?auth=` + token, personeExpense);
                }  else {
                    return of(null);
                }
            }
            )
        );


    }

    // createUserExpenses(id: string, personeExpense: PersoneExpense){

    // }

    //   updateExpense(index: number, newRecipe: Expenses.month) {
    //   }

    //   deleteExpense(index: number) {
    //   }
}
