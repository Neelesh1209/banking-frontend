import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NavbarComponent } from '../navbar/navbar.component';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent {

  depositData = {
    accountNumber: '',
    accountType: '',
    amount: null as number | null,
    email: '',
    otp: ''
  };

  otpSent = false;
  message = '';

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService
  ) {}

  sendOtp(): void {

    const email = this.authService.getLoggedInEmail();

    if (!email) {
      this.message = 'User not logged in';
      return;
    }

    this.depositData.email = email;

    this.transactionService.sendTransactionOtp(email).subscribe({
      next: () => {
        this.otpSent = true;
        this.message = 'OTP sent to your email';
      },
      error: () => {
        this.message = 'Failed to send OTP';
      }
    });
  }

  deposit(): void {

    this.transactionService.deposit(this.depositData).subscribe({
      next: () => {
        this.message = 'Deposit successful!';

        this.depositData = {
          accountNumber: '',
          accountType: '',
          amount: null,
          email: '',
          otp: ''
        };

        this.otpSent = false;
      },
      error: (err) => {
        this.message = err.error?.message || 'Deposit failed';
      }
    });
  }
}