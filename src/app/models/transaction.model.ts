export interface Transaction {
  id?: number;
  fromAccountId?: number;
  toAccountId?: number;
  transactionType: string;
  amount: number;
  transactionDate?: string;
}