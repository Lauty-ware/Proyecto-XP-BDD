export interface User {
  id: string;
  email: string;
  passwordHash: string;
  balance: number;
  role: 'user' | 'admin';
  createdAt: Date;
}