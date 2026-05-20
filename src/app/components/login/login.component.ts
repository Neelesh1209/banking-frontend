import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  credentials = {
    email: '',
    password: ''
  };

  otp = '';
  otpSent = false;
  message = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  sendLoginOtp(): void {

    if (
      !this.credentials.email.trim() ||
      !this.credentials.password.trim()
    ) {
      this.message = 'Email and password are required';
      return;
    }

    this.authService.sendLoginOtp(this.credentials).subscribe({
      next: () => {
        this.otpSent = true;
        this.message = 'OTP sent to your email';
      },
      error: () => {
        this.message = 'Invalid email or password';
      }
    });
  }

  verifyLogin(): void {

    if (!this.otp.trim()) {
      this.message = 'Enter OTP';
      return;
    }

    const payload = {
      email: this.credentials.email,
      password: this.credentials.password,
      otp: this.otp
    };

    this.authService.verifyLogin(payload).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.message = 'Login successful!';

        this.credentials = {
          email: '',
          password: ''
        };

        this.otp = '';
        this.otpSent = false;

        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.message = 'Invalid or expired OTP';
      }
    });
  }
}