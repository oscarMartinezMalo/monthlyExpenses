import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

// Option groups autocomplete
export interface StateGroup {
  letter: string;
  names: string[];
}

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

  // stateForm: FormGroup = this._formBuilder.group({
  //   stateGroup: '',
  // });

  stateGroups: StateGroup[] = [{
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


  stateGroupOptions: Observable<StateGroup[]>;
  // tslint:disable-next-line:variable-name
  // constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
    // tslint:disable-next-line:no-non-null-assertion

    // tslint:disable-next-line:no-non-null-assertion
    // this.stateGroupOptions = this.expenseForm.get('stateGroup')!.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filterGroup(value))
    //   );
  }

  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({ letter: group.letter, names: _filter(group.names, value) }))
        .filter(group => group.names.length > 0);
    }

    return this.stateGroups;
  }

  private initForm() {
    const monthlyIncome = '';
    const expensesArray = new FormArray([]);


    this.expenseForm = new FormGroup({
      income: new FormControl(monthlyIncome, [Validators.pattern(/^[1-9]+[0-9]*$/)]),
      expenses: expensesArray
    });

    // This code if you want to start with one empty
    // this.onAddExpense();

    // Calculate everything when a change is detected
    this.expenseForm.valueChanges.subscribe(() => {
      this.calculateTotalExpenses();
    });
  }


  onAddExpense() {

    (this.expenseForm.get('expenses') as FormArray).push(
      new FormGroup({
        expenseName: new FormControl(''),
        // name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );

    // tslint:disable-next-line:no-non-null-assertion
    this.stateGroupOptions = ((this.expenseForm.get('expenses') as FormArray).at(0) as FormGroup).controls.expenseName!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
    // this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;

  }

  onDeleteExpense(index: number) {
    (this.expenseForm.get('expenses') as FormArray).removeAt(index);
    // this.calculateTotalExpenses();
  }

  onNameLeave(index: number) {
    const rowValue = ((this.expenseForm.get('expenses') as FormArray).at(index) as FormGroup).controls;
    if (rowValue.amount.value == null && rowValue.expenseName.value === '') {
      (this.expenseForm.get('expenses') as FormArray).removeAt(index);
    }
  }

  onAmountLeave(index: number) {
    this.onNameLeave(index);
    // this.calculateTotalExpenses();
  }

  calculateTotalExpenses() {
    // Recalcule the expenses
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
