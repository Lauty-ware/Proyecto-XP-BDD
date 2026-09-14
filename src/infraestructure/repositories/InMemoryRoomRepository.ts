import { Room } from '../../domain/entities/Room';
import { RoomRepository } from '../../application/ports/RoomRepository';

export class InMemoryRoomRepository implements RoomRepository {
  private rooms = new Map<string, Room>();

  async findById(id: string): Promise<Room | null> {
    return this.rooms.get(id) ?? null;
  }

  async findByName(name: string): Promise<Room | null> {
    for (const r of this.rooms.values()) if (r.name === name) return r;
    return null;
  }

  async findAll(minCapacity?: number): Promise<Room[]> {
    const all = Array.from(this.rooms.values());
    return minCapacity ? all.filter((r) => r.capacity >= minCapacity) : all;
  }

  async save(room: Room): Promise<void> {
    this.rooms.set(room.id, { ...room });
  }

  async delete(id: string): Promise<void> {
    this.rooms.delete(id);
  }

  clear(): void {
    this.rooms.clear();
  }
}