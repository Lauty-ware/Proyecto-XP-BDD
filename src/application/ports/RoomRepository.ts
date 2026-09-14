import { Room } from '../../domain/entities/Room';

export interface RoomRepository {
  findById(id: string): Promise<Room | null>;
  findByName(name: string): Promise<Room | null>;
  findAll(minCapacity?: number): Promise<Room[]>;
  save(room: Room): Promise<void>;
  delete(id: string): Promise<void>;
}