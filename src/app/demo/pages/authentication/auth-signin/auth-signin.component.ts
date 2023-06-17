import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/_service/auth copy/auth.service';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss'],
})
export default class AuthSigninComponent {

  loginForm!: FormGroup;

  submitted: boolean;
  loading: boolean;

  alert: { type: 'success' | 'danger'; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService,
    private _fb: FormBuilder) {

  }

  ngOnInit() {
    localStorage.clear()

    this.loginForm = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {

    // Return if the form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.submitted = true;
    this.loading = true;

    // Disable the form
    this.loginForm.disable();

    this.showAlert = false;

    this._authService.signIn(this.loginForm.value).pipe()
      .subscribe(
        () => {

          // Set the redirect url.
          // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
          // to the correct page after a successful sign in. This way, that url can be set via
          // routing file and we don't have to touch here.
          const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

          // Navigate to the redirect url
          this._router.navigateByUrl(redirectURL);

        },
        (response) => {

          // Re-enable the form
          this.loginForm.enable();

          // Reset the form
          this.loginForm.reset();

          this.loading = false;

          this.showAlert = true;

          this.alert = {
            type: 'danger',
            message: 'ผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง! โปรดลองใหม่อีกครั้ง'
          };

        }
      );
  }

}
