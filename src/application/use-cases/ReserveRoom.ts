import { randomUUID } from 'node:crypto';
import { Reservation } from '../../domain/entities/Reservation';
import { DomainError } from '../../domain/errors/DomainError';
import { UserRepository } from '../ports/UserRepository';
import { RoomRepository } from '../ports/RoomRepository';
import { ReservationRepository } from '../ports/ReservationRepository';

export class ReserveRoom {
  constructor(
    private readonly users: UserRepository,
    private readonly rooms: RoomRepository,
    private readonly reservations: ReservationRepository
  ) {}

  async execute(input: { userEmail: string; roomName: string; date: string }): Promise<Reservation> {
    const user = await this.users.findByEmail(input.userEmail.trim().toLowerCase());
    if (!user) throw new DomainError('Usuario no encontrado', 'USER_NOT_FOUND');

    const room = await this.rooms.findByName(input.roomName);
    if (!room) throw new DomainError('Sala no encontrada', 'ROOM_NOT_FOUND');

    const existing = await this.reservations.findActiveByRoomAndDate(room.id, input.date);
    if (existing) throw new DomainError('La sala no está disponible', 'ROOM_UNAVAILABLE');

    if (user.balance < room.price) {
      throw new DomainError('Saldo insuficiente', 'INSUFFICIENT_BALANCE');
    }

    const reservation: Reservation = {
      id: randomUUID(),
      userId: user.id,
      roomId: room.id,
      date: input.date,
      status: 'active',
      pricePaid: room.price,
      createdAt: new Date()
    };

    user.balance -= room.price;
    await this.users.update(user);
    await this.reservations.save(reservation);

    return reservation;
  }
}