import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl = 'http://localhost:8080/account-service/accounts';

  constructor(private http: HttpClient) {}

  getAccountsByUserId(userId: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/user/${userId}`);
  }

  createAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(this.baseUrl, account);
  }

  deleteAccount(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      responseType: 'text'
    });
  }
}