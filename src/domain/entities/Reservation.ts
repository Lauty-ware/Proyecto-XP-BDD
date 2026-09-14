export type ReservationStatus = 'active' | 'cancelled' | 'completed';

export interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  date: string; // ISO YYYY-MM-DD
  status: ReservationStatus;
  pricePaid: number;
  createdAt: Date;
}