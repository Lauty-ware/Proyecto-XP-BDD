import { Reservation } from '../../domain/entities/Reservation';
import { ReservationRepository } from '../../application/ports/ReservationRepository';

export class InMemoryReservationRepository implements ReservationRepository {
  private reservations = new Map<string, Reservation>();

  async findActiveByRoomAndDate(roomId: string, date: string): Promise<Reservation | null> {
    for (const r of this.reservations.values()) {
      if (r.roomId === roomId && r.date === date && r.status === 'active') return r;
    }
    return null;
  }

  async findByUserRoomAndDate(
    userId: string,
    roomId: string,
    date: string
  ): Promise<Reservation | null> {
    for (const r of this.reservations.values()) {
      if (r.userId === userId && r.roomId === roomId && r.date === date && r.status === 'active') {
        return r;
      }
    }
    return null;
  }

  async findByUserAndDate(userId: string, date: string): Promise<Reservation | null> {
    for (const r of this.reservations.values()) {
      if (r.userId === userId && r.date === date && r.status === 'active') {
        return r;
      }
    }
    return null;
  }

  async findActiveByRoom(roomId: string): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter(
      (r) => r.roomId === roomId && r.status === 'active'
    );
  }

  async save(reservation: Reservation): Promise<void> {
    this.reservations.set(reservation.id, { ...reservation });
  }

  async update(reservation: Reservation): Promise<void> {
    this.reservations.set(reservation.id, { ...reservation });
  }

  clear(): void {
    this.reservations.clear();
  }
}