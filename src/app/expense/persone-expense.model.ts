import { MonthlyExpense } from './monthly-expense.component';

export class PersoneExpense {
    inconme: number;
    public monthlyExpenses: MonthlyExpense[] = [];

    constructor(income: number, MonthlyExpenses: MonthlyExpense[]) {
        this.inconme = income;
        this.monthlyExpenses = MonthlyExpenses;
      }
}
