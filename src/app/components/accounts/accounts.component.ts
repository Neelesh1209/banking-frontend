import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';

import { Account } from '../../models/account.model';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  accounts: Account[] = [];
  submitted = false;
  errorMessage = '';
  loggedInUserId = 0;

  newAccount: Account = {
    userId: 0,
    accountHolderName: '',
    accountType: '',
    balance: 0,
    nomineeName: ''
  };

  constructor(
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLoggedInUser();
  }

  loadLoggedInUser(): void {
    const email = this.authService.getLoggedInEmail();

    if (!email) return;

    this.authService.getUserByEmail(email).subscribe({
      next: (user) => {
        this.loggedInUserId = user.id;
        this.newAccount.userId = user.id;
        this.newAccount.accountHolderName = user.name;
        this.loadAccounts();
      }
    });
  }

  loadAccounts(): void {
    this.accountService.getAccountsByUserId(this.loggedInUserId).subscribe({
      next: (data) => {
        this.accounts = data;
      }
    });
  }

  createAccount(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (
      !this.newAccount.accountType ||
      !this.newAccount.nomineeName?.trim() ||
      this.newAccount.balance < 0
    ) {
      return;
    }

    this.accountService.createAccount(this.newAccount).subscribe({
      next: () => {
        this.newAccount.accountType = '';
        this.newAccount.balance = 0;
        this.newAccount.nomineeName = '';
        this.submitted = false;
        this.loadAccounts();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Account creation failed';
      }
    });
  }

  deleteAccount(id: number): void {
    if (confirm('Are you sure you want to delete this account?')) {
      this.accountService.deleteAccount(id).subscribe({
        next: () => {
          this.loadAccounts();
        }
      });
    }
  }
}