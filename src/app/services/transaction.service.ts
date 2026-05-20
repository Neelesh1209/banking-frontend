import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private baseUrl =
    'http://localhost:8080/transaction-service/transactions';

  // DIRECT AUTH SERVICE (avoid gateway CORS duplicate issue)
  private authUrl =
    'http://localhost:8083/auth';

  constructor(private http: HttpClient) {}

  sendTransactionOtp(email: string): Observable<any> {
    return this.http.post(
      `${this.authUrl}/send-transaction-otp`,
      { email },
      { responseType: 'text' as 'json' }
    );
  }

  deposit(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/deposit`, data);
  }

  withdraw(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/withdraw`, data);
  }

  transfer(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/transfer`, data);
  }

  getHistory(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }
}