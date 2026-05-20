import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NavbarComponent } from '../navbar/navbar.component';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent {

  transferData = {
    fromAccountNumber: '',
    toAccountNumber: '',
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

    this.transferData.email = email;

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

  transfer(): void {

    this.transactionService.transfer(this.transferData).subscribe({
      next: () => {
        this.message = 'Transfer successful!';

        this.transferData = {
          fromAccountNumber: '',
          toAccountNumber: '',
          accountType: '',
          amount: null,
          email: '',
          otp: ''
        };

        this.otpSent = false;
      },
      error: (err) => {
        this.message = err.error?.message || 'Transfer failed';
      }
    });
  }
}