import { MonthlyExpense } from './monthly-expense.component';

export class PersoneExpense {
    income: number;
    public expenses: MonthlyExpense[] = [];

    constructor(income: number, expenses: MonthlyExpense[]) {
        this.income = income;
        this.expenses = expenses;
      }
}
