import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PersoneExpense } from './persone-expense.model';
import { MonthlyExpense } from './monthly-expense.component';

export interface DropDownCategory {
    letter: string;
    names: string[];
}

@Injectable()
export class ExpenseService {
  private personalExp: PersoneExpense = new PersoneExpense(
      2200, [
          new MonthlyExpense('Rent', 200),
          new MonthlyExpense('Nails', 150),
          new MonthlyExpense('Insurance', 75),
          new MonthlyExpense('Nails', 150),
          new MonthlyExpense('Insurance', 75),
          new MonthlyExpense('Nails', 150),
          new MonthlyExpense('Insurance', 75),
          new MonthlyExpense('Nails', 150),
          new MonthlyExpense('Insurance', 75)
      ]);

      private dropDownCategories: DropDownCategory[]  = [{
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
        names: ['Restaurant']
      }, {
        letter: 'U',
        names: ['Uber, Lyft']
      }];

  constructor() {}

    getExpense() {
        return this.personalExp;
    }

    getDrownDownCategory() {
        return this.dropDownCategories.slice();
    }

//   addExpense(expense: Expense.month) {
//   }

//   updateExpense(index: number, newRecipe: Expenses.month) {
//   }

//   deleteExpense(index: number) {
//   }
}
