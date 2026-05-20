export interface Account {
  id?: number;
  userId: number;
  accountHolderName: string;
  accountNumber?: string;
  accountType: string;
  balance: number;
  nomineeName: string;
  status?: string;
  createdAt?: string;
}