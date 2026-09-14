import { Reservation } from '../../domain/entities/Reservation';

export interface ReservationRepository {
  findActiveByRoomAndDate(roomId: string, date: string): Promise<Reservation | null>;
  findByUserRoomAndDate(userId: string, roomId: string, date: string): Promise<Reservation | null>;
  findByUserAndDate(userId: string, date: string): Promise<Reservation | null>;
  findActiveByRoom(roomId: string): Promise<Reservation[]>;
  save(reservation: Reservation): Promise<void>;
  update(reservation: Reservation): Promise<void>;
}