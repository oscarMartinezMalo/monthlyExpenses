import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { startWith, map, switchMap, take } from 'rxjs/operators';
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
export class ExpenseComponent implements OnInit, OnDestroy {
  @ViewChild('scrollMe', { static: true }) myScrollContainer: ElementRef;

  // Reactive form
  expenseForm: FormGroup;
  formChange: Subscription;
  totalExpended = 0;
  totalSave = 0;

  // Load the dropdown Data
  expenseCategories = this.expenseService.getDrownDownCategory();
  expenseGroupOptions: Observable<DropDownCategory[]>;

  constructor(private expenseService: ExpenseService) { }

  ngOnInit() {
    const expensesArray = new FormArray([]);
    const monthlyIncome = 0;

    // Create the formGroup that is linked with the html form
    this.expenseForm = new FormGroup({
      income: new FormControl(monthlyIncome, [Validators.pattern(/^[1-9]+[0-9]*$/)]),
      expenses: expensesArray
    });

    // Load the data on the View
    this.initialDataLoad();

    // This code if you want to start with one empty
    // this.createExpense('', null);

    // Calculate the Expended and Saved when a change is detected
    this.calculateSaveOnChange();
  }

  initialDataLoad() {
    this.expenseService.getExpense().pipe(take(1)).
      subscribe(
        (response) => {
          if (response !== null) {
            if (response.income !== null) {
              this.expenseForm.controls.income.setValue(response.income);
            }

            if (response.expenses !== null && response.expenses !== undefined) {
              // Load the expenses comming from the service
              for (const monthlyExpense of response.expenses) {
                this.createExpense(monthlyExpense.type, monthlyExpense.amount);
              }

            }
          }
        });
  }

  calculateSaveOnChange() {
    // Calculate the Expended and Saved when a change is detected
    this.formChange = this.expenseForm.valueChanges.subscribe(() => {

      if (this.expenseForm.dirty) {
        // Recalculate the expenses to show in the screen
        this.calculateTotalExpenses();

        // take(1) operator which is great because it automatically unsubscribes after the first execution
        this.expenseService.storeExpenses(this.expenseForm.value).pipe(take(1))
          .subscribe((response) => {
            if (response !== null) {
              // CHanges were made
            }
          },
            err => console.error('Observer got an error: ' + err),
            () => {
              // After is inserted or removed any value is gonna scroll to the bottom
              this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            });
      }

    });
  }

  ngOnDestroy(): void {
    // Destroy the form subscribtion after they leave the view if you not use
    // this.formChange.unsubscribe();

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

    // take(1) operator which is great because it automatically unsubscribes after the first execution
    (this.expenseForm.get('expenses') as FormArray).removeAt(index);
    this.expenseService.deleteExpense(this.expenseForm.value).pipe(take(1))
      .subscribe((response) => {
        if (response !== null) {
          // Delete the row from the UI          
        }
      }, error => {
        console.log('Refresh the page something when wrong');
      });

    // });
  }

  onAddExpense() {
    this.createExpense('', null);
  }

  onNameLeave(index: number) {
    const rowValue = ((this.expenseForm.get('expenses') as FormArray).at(index) as FormGroup).controls;
    if (rowValue.amount.value == null && rowValue.type.value === '') {
      (this.expenseForm.get('expenses') as FormArray).removeAt(index);
    }
  }

  onAmountLeave(index: number) {
    this.onNameLeave(index);
  }

  createExpense(type: string, amount: number) {
    // tslint:disable-next-line:prefer-const
    let expenseGroupOptions: Observable<DropDownCategory[]>;

    const FormGroupCreated = new FormGroup({
      type: new FormControl(type),
      amount: new FormControl(amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    });

    (this.expenseForm.get('expenses') as FormArray).push(FormGroupCreated);

    // tslint:disable-next-line:no-non-null-assertion
    this.expenseGroupOptions = FormGroupCreated.controls.type!.valueChanges
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
          type: new FormControl(null, Validators.required),
          amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
        })
      );
    }
  }

}
