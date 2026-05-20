import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from '../navbar/navbar.component';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  transactions: any[] = [];
  message = '';

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    const email = this.authService.getLoggedInEmail();

    if (!email) return;

    this.authService.getUserByEmail(email).subscribe({
      next: (user) => {
        this.transactionService.getHistory(user.id).subscribe({
          next: (data) => {
            this.transactions = data;
          },
          error: () => {
            this.message = 'Failed to load history';
          }
        });
      }
    });
  }
}