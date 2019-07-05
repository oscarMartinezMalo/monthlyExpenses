import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {

  formForgotPass: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.formForgotPass = fb.group({
      email: ['', [Validators.required, this.emailValid()]]
    });
  }

  ngOnInit() {
  }

  sendEmail() {
    // console.log(this.form.get("confirmPassword").errors );
    if (this.formForgotPass.valid) {
      this.auth.sendResetEmail(this.formForgotPass.value.email);
    }
  }

  isValid(control) {
    return (this.formForgotPass.controls[control].invalid && this.formForgotPass.controls[control].touched);
  }

  emailValid() {
    return control => {
      // tslint:disable-next-line:max-line-length
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return regex.test(control.value) ? null : { invalidEmail: true };
    };
  }
}
