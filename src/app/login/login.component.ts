import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])

  });

  message = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {

    console.log('1. LOGIN BUTTON CLICKED');

    console.log(
      '2. FORM VALUE:',
      this.loginForm.value
    );

    console.log(
      '3. FORM VALID:',
      this.loginForm.valid
    );

    // Check form validation
    if (this.loginForm.invalid) {

      console.log('4. FORM IS INVALID');

      this.loginForm.markAllAsTouched();

      this.message =
        'Please enter valid email and password.';

      return;
    }

    // Get form values
    const email =
      this.loginForm.value.email ?? '';

    const password =
      this.loginForm.value.password ?? '';

    console.log(
      '5. EMAIL:',
      email
    );

    console.log(
      '6. PASSWORD:',
      password
    );

    console.log(
      '7. CALLING AUTH SERVICE...'
    );

    // Call login API
    this.authService
      .login(email, password)
      .subscribe({

        // API Success
        next: (response: any) => {

          console.log(
            '8. LOGIN API SUCCESS:',
            response
          );

          console.log(
            '9. LOGIN RESPONSE:',
            JSON.stringify(
              response,
              null,
              2
            )
          );

          // Save token
          localStorage.setItem(
            'token',
            response.tokenString
          );

          // Check saved token
          console.log(
            '10. SAVED TOKEN:',
            localStorage.getItem('token')
          );

          this.message =
            'Login Successful!';

          // Navigate to dashboard
          this.router.navigate([
            '/dashboard'
          ]);

        },

        // API Error
        error: (error) => {

          console.error(
            'API ERROR:',
            error
          );

          console.log(
            'STATUS:',
            error.status
          );

          console.log(
            'ERROR BODY:',
            error.error
          );

          this.message =
            'Login Failed!';

        }

      });

  }

}