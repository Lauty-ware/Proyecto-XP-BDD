import { Room } from '../../domain/entities/Room';
import { RoomRepository } from '../ports/RoomRepository';
import { ReservationRepository } from '../ports/ReservationRepository';

export class ListAvailableRooms {
  constructor(
    private readonly rooms: RoomRepository,
    private readonly reservations: ReservationRepository
  ) {}

  async execute(date: string, minCapacity?: number): Promise<Room[]> {
    const all = await this.rooms.findAll(minCapacity);
    const available: Room[] = [];
    for (const room of all) {
      const conflict = await this.reservations.findActiveByRoomAndDate(room.id, date);
      if (!conflict) available.push(room);
    }
    return available;
  }
}