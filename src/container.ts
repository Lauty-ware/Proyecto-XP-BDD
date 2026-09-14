import { InMemoryUserRepository } from './infraestructure/repositories/InMemoryUserRepository';
import { InMemoryRoomRepository } from './infraestructure/repositories/InMemoryRoomRepository';
import { InMemoryReservationRepository } from './infraestructure/repositories/InMemoryReservationRepository';
import { BcryptHasher } from './infraestructure/crypto/BcryptHasher';
import { JwtService } from './infraestructure/jwt/JwtService';
import { RegisterUser } from './application/use-cases/RegisterUser';
import { LoginUser } from './application/use-cases/LoginUser';
import { ReserveRoom } from './application/use-cases/ReserveRoom';
import { CancelReservation } from './application/use-cases/CancelReservation';
import { ListAvailableRooms } from './application/use-cases/ListAvailableRooms';
import { ManageRoom } from './application/use-cases/ManageRoom';

export interface Container {
  users: InMemoryUserRepository;
  rooms: InMemoryRoomRepository;
  reservations: InMemoryReservationRepository;
  hasher: BcryptHasher;
  tokens: JwtService;
  registerUser: RegisterUser;
  loginUser: LoginUser;
  reserveRoom: ReserveRoom;
  cancelReservation: CancelReservation;
  listAvailableRooms: ListAvailableRooms;
  manageRoom: ManageRoom;
}

export function buildContainer(env: {
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptRounds: number;
}): Container {
  const users = new InMemoryUserRepository();
  const rooms = new InMemoryRoomRepository();
  const reservations = new InMemoryReservationRepository();
  const hasher = new BcryptHasher(env.bcryptRounds);
  const tokens = new JwtService(env.jwtSecret, env.jwtExpiresIn);

  return {
    users,
    rooms,
    reservations,
    hasher,
    tokens,
    registerUser: new RegisterUser(users, hasher),
    loginUser: new LoginUser(users, hasher, tokens),
    reserveRoom: new ReserveRoom(users, rooms, reservations),
    cancelReservation: new CancelReservation(users, rooms, reservations),
    listAvailableRooms: new ListAvailableRooms(rooms, reservations),
    manageRoom: new ManageRoom(rooms, reservations)
  };
}
