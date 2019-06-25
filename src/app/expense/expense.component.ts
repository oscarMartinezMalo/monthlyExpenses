import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ExpenseService, DropDownCategory } from './expense.service';

// tslint:disable-next-line:variable-name
export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};
// End Option groups autocomplete

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  @ViewChild('scrollMe', { static: true }) myScrollContainer: ElementRef;

  // Reactive form
  expenseForm: FormGroup;
  totalExpended = 0;
  totalSave = 0;
  // Load the dropdown Data
  expenseCategories = this.expenseService.getDrownDownCategory();
  expenseGroupOptions: Observable<DropDownCategory[]>;

  constructor(private expenseService: ExpenseService) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    let monthlyIncome = 0;
    const expensesArray = new FormArray([]);

    // Get data from the service
    const personExpenses = this.expenseService.getExpense();
    monthlyIncome = personExpenses.inconme;

    // Create the formGroup that is linked with the html form
    this.expenseForm = new FormGroup({
      income: new FormControl(monthlyIncome, [Validators.pattern(/^[1-9]+[0-9]*$/)]),
      expenses: expensesArray
    });

    // Load the expenses comming from the service
    for (const monthlyExpense of personExpenses.monthlyExpenses) {
      this.createExpense(monthlyExpense.type, monthlyExpense.amount);
    }

    // This code if you want to start with one empty
    this.createExpense('', null);

    // Calculate the Expended and Saved when a change is detected
    this.expenseForm.valueChanges.subscribe(() => {
      this.calculateTotalExpenses();
    });

  }

  // Dropdown method
  private _filterGroup(value: string): DropDownCategory[] {
    if (value) {
      return this.expenseCategories
        .map(group => ({ letter: group.letter, names: _filter(group.names, value) }))
        .filter(group => group.names.length > 0);
    }
    return this.expenseCategories;
  }

  onDeleteExpense(index: number) {
    (this.expenseForm.get('expenses') as FormArray).removeAt(index);
  }

  onAddExpense() {
    this.createExpense('', null);
  }

  onNameLeave(index: number) {
    const rowValue = ((this.expenseForm.get('expenses') as FormArray).at(index) as FormGroup).controls;
    if (rowValue.amount.value == null && rowValue.expenseName.value === '') {
      (this.expenseForm.get('expenses') as FormArray).removeAt(index);
    }
  }

  onAmountLeave(index: number) {
    this.onNameLeave(index);
  }

  createExpense( type: string, amount: number) {
    // tslint:disable-next-line:prefer-const
    let expenseGroupOptions: Observable<DropDownCategory[]>;

    const FormGroupCreated = new FormGroup({
      expenseName: new FormControl(type),
      amount: new FormControl(amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    });

    (this.expenseForm.get('expenses') as FormArray).push( FormGroupCreated );

    // tslint:disable-next-line:no-non-null-assertion
    this.expenseGroupOptions = FormGroupCreated.controls.expenseName!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
  }

  calculateTotalExpenses() {
    // Recalculate the expenses
    this.totalExpended = 0;
    for (let i = 0; i < (this.expenseForm.get('expenses') as FormArray).length; i++) {
      this.totalExpended += ((this.expenseForm.get('expenses') as FormArray).at(i) as FormGroup).controls.amount.value;
    }
    this.totalSave = this.expenseForm.value.income - this.totalExpended;
  }

  onAmountPressEnter(index) {
    // Check if the cursor is in the last Amount and if the form is valid add a new line
    if ((index === ((this.expenseForm.get('expenses') as FormArray).length) - 1) && this.expenseForm.valid) {
      (this.expenseForm.get('expenses') as FormArray).push(
        new FormGroup({
          expenseName: new FormControl(null, Validators.required),
          amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
        })
      );
    }
  }

}
