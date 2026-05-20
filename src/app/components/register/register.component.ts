import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  user = {
    name: '',
    email: '',
    password: ''
  };

  otp = '';
  otpSent = false;
  message = '';

  constructor(private authService: AuthService) {}

  sendOtp(): void {

  if (
    !this.user.name.trim() ||
    !this.user.email.trim() ||
    !this.user.password.trim()
  ) {
    this.message = 'Fill all fields first';
    return;
  }

  this.authService.sendOtp(this.user.email).subscribe({
    next: (response) => {
      console.log('OTP success:', response);
      this.otpSent = true;
      this.message = 'OTP sent to your email';
    },
    error: (err) => {
      console.error('OTP error:', err);
      this.message = 'Failed to send OTP';
    }
  });
  }

  verifyAndRegister(): void {

    if (!this.otp.trim()) {
      this.message = 'Enter OTP';
      return;
    }

    const payload = {
      name: this.user.name,
      email: this.user.email,
      password: this.user.password,
      otp: this.otp
    };

    this.authService.verifyAndRegister(payload).subscribe({
      next: () => {
        this.message = 'Registration successful!';

        this.user = {
          name: '',
          email: '',
          password: ''
        };

        this.otp = '';
        this.otpSent = false;
      },
      error: () => {
        this.message = 'Invalid or expired OTP';
      }
    });
  }
}