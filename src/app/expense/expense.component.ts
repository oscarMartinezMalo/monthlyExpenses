import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  // Reactive form
  expenseForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    const monthlyIncome = '';
    const expensesArray = new FormArray([]);

    this.expenseForm = new FormGroup({
      income: new FormControl(monthlyIncome),
      expenses: expensesArray
    });
  }

  onAddExpense() {
    console.log(this.expenseForm.controls.income.value);
    (this.expenseForm.get('expenses') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }

  onDeleteExpense(index: number) {
    (this.expenseForm.get('expenses') as FormArray).removeAt(index);
  }

  onDeleteEmptyRow(index: number) {
    const rowValue = ((this.expenseForm.get('expenses') as FormArray).at(index) as FormGroup).controls;
    if (rowValue.amount.value == null && rowValue.name.value === '') {
      (this.expenseForm.get('expenses') as FormArray).removeAt(index);
    }
  }

}
