import { DomainError } from '../../domain/errors/DomainError';
import { UserRepository } from '../ports/UserRepository';
import { RoomRepository } from '../ports/RoomRepository';
import { ReservationRepository } from '../ports/ReservationRepository';

export class CancelReservation {
  constructor(
    private readonly users: UserRepository,
    private readonly rooms: RoomRepository,
    private readonly reservations: ReservationRepository
  ) {}

  async execute(input: { userEmail: string; roomName: string; date: string }): Promise<void> {
    const user = await this.users.findByEmail(input.userEmail.trim().toLowerCase());
    if (!user) throw new DomainError('Usuario no encontrado', 'USER_NOT_FOUND');

    const reservation = await this.reservations.findByUserAndDate(user.id, input.date);
    if (!reservation || reservation.status !== 'active') {
      throw new DomainError('Reserva no encontrada', 'RESERVATION_NOT_FOUND');
    }

    const room = await this.rooms.findById(reservation.roomId);
    if (!room || room.name !== input.roomName) {
      throw new DomainError('Reserva no encontrada', 'RESERVATION_NOT_FOUND');
    }

    reservation.status = 'cancelled';
    user.balance += reservation.pricePaid;

    await this.reservations.update(reservation);
    await this.users.update(user);
  }
}