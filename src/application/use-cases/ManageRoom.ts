import { randomUUID } from 'node:crypto';
import { Room } from '../../domain/entities/Room';
import { DomainError } from '../../domain/errors/DomainError';
import { RoomRepository } from '../ports/RoomRepository';
import { ReservationRepository } from '../ports/ReservationRepository';

export class ManageRoom {
  constructor(
    private readonly rooms: RoomRepository,
    private readonly reservations: ReservationRepository
  ) {}

  async create(input: { name: string; capacity: number; price: number }): Promise<Room> {
    if (!input.name || input.capacity <= 0 || input.price < 0) {
      throw new DomainError('Datos de sala inválidos', 'INVALID_ROOM');
    }
    const existing = await this.rooms.findByName(input.name);
    if (existing) throw new DomainError('Ya existe una sala con ese nombre', 'ROOM_TAKEN');

    const room: Room = {
      id: randomUUID(),
      name: input.name,
      capacity: input.capacity,
      price: input.price,
      createdAt: new Date()
    };
    await this.rooms.save(room);
    return room;
  }

  async delete(name: string): Promise<void> {
    const room = await this.rooms.findByName(name);
    if (!room) throw new DomainError('Sala no encontrada', 'ROOM_NOT_FOUND');

    const active = await this.reservations.findActiveByRoom(room.id);
    if (active.length > 0) {
      throw new DomainError(
        'No se puede eliminar una sala con reservas activas',
        'ROOM_HAS_RESERVATIONS'
      );
    }
    await this.rooms.delete(room.id);
  }
}