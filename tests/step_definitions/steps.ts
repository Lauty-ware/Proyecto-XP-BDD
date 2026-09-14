import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { AppWorld } from '../support/world';

const asWorld = function (this: any): AppWorld {
  return this as AppWorld;
};

const saveUser = async (
  world: AppWorld,
  email: string,
  password: string,
  balance = 100,
  role: 'user' | 'admin' = 'user'
) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: randomUUID(),
    email: email.trim().toLowerCase(),
    passwordHash,
    balance,
    role,
    createdAt: new Date()
  };

  await world.container.users.save(user);
  return user;
};

const saveRoom = async (
  world: AppWorld,
  name: string,
  price: number,
  capacity = 10
) => {
  const room = {
    id: randomUUID(),
    name,
    capacity,
    price,
    createdAt: new Date()
  };

  await world.container.rooms.save(room);
  return room;
};

Given('que soy administrador', function (this: any) {
  const world = asWorld.call(this);
  world.lastError = null;
});

Given('que no existe un usuario con email {string}', async function (this: any, email: string) {
  const world = asWorld.call(this);
  const existing = await world.container.users.findByEmail(email.trim().toLowerCase());
  assert.equal(existing, null);
});

Given('que ya existe un usuario con email {string}', async function (this: any, email: string) {
  const world = asWorld.call(this);
  await saveUser(world, email, 'Password123', 100, 'user');
});

Given('que existe un usuario {string} con contraseña {string}', async function (
  this: any,
  email: string,
  password: string
) {
  const world = asWorld.call(this);
  await saveUser(world, email, password, 100, 'user');
});

Given('que existe un usuario {string} con saldo {int}', async function (
  this: any,
  email: string,
  balance: number
) {
  const world = asWorld.call(this);
  await saveUser(world, email, 'Password123', balance, 'user');
});

Given('que existe la sala {string} con precio {int}', async function (
  this: any,
  name: string,
  price: number
) {
  const world = asWorld.call(this);
  await saveRoom(world, name, price, 10);
});

Given('que existen las salas {string} y {string}', async function (
  this: any,
  nameA: string,
  nameB: string
) {
  const world = asWorld.call(this);
  await saveRoom(world, nameA, 50, 10);
  await saveRoom(world, nameB, 80, 10);
});

Given('que {string} ya reservó la sala {string} para el día {string}', async function (
  this: any,
  userEmail: string,
  roomName: string,
  date: string
) {
  const world = asWorld.call(this);
  const user = await world.container.users.findByEmail(userEmail.trim().toLowerCase());
  assert.ok(user, `Usuario ${userEmail} no existe`);
  const room = await world.container.rooms.findByName(roomName);
  assert.ok(room, `Sala ${roomName} no existe`);

  const reservation = {
    id: randomUUID(),
    userId: user.id,
    roomId: room.id,
    date,
    status: 'active' as const,
    pricePaid: room.price,
    createdAt: new Date()
  };

  user.balance -= room.price;
  await world.container.users.update(user);
  await world.container.reservations.save(reservation);
});

When('me registro con email {string} y contraseña {string}', async function (
  this: any,
  email: string,
  password: string
) {
  const world = asWorld.call(this);
  try {
    world.lastUser = await world.container.registerUser.execute({ email, password });
    world.lastError = null;
  } catch (error) {
    world.lastError = error as Error;
    world.lastUser = null;
  }
});

When('inicio sesión con email {string} y contraseña {string}', async function (
  this: any,
  email: string,
  password: string
) {
  const world = asWorld.call(this);
  try {
    const result = await world.container.loginUser.execute(email, password);
    world.lastToken = result.token;
    world.lastUser = result.user;
    world.lastError = null;
  } catch (error) {
    world.lastError = error as Error;
    world.lastToken = null;
    world.lastUser = null;
  }
});

When('{string} reserva la sala {string} para el día {string}', async function (
  this: any,
  userEmail: string,
  roomName: string,
  date: string
) {
  const world = asWorld.call(this);
  try {
    world.lastReservation = await world.container.reserveRoom.execute({
      userEmail,
      roomName,
      date
    });
    world.lastError = null;
  } catch (error) {
    world.lastError = error as Error;
    world.lastReservation = null;
  }
});

When('{string} cancela su reserva en {string} para el día {string}', async function (
  this: any,
  userEmail: string,
  roomName: string,
  date: string
) {
  const world = asWorld.call(this);
  try {
    await world.container.cancelReservation.execute({ userEmail, roomName, date });
    world.lastError = null;
  } catch (error) {
    world.lastError = error as Error;
  }
});

When('consulto salas disponibles para el día {string}', async function (
  this: any,
  date: string
) {
  const world = asWorld.call(this);
  world.lastRooms = await world.container.listAvailableRooms.execute(date);
  world.lastError = null;
});

When('creo la sala {string} con capacidad {int} y precio {int}', async function (
  this: any,
  name: string,
  capacity: number,
  price: number
) {
  const world = asWorld.call(this);
  try {
    world.lastRoom = await world.container.manageRoom.create({ name, capacity, price });
    world.lastError = null;
  } catch (error) {
    world.lastError = error as Error;
    world.lastRoom = null;
  }
});

When('intento eliminar la sala {string}', async function (this: any, roomName: string) {
  const world = asWorld.call(this);
  try {
    await world.container.manageRoom.delete(roomName);
    world.lastError = null;
  } catch (error) {
    world.lastError = error as Error;
  }
});

Then('el registro debe ser exitoso', function (this: any) {
  const world = asWorld.call(this);
  assert.ok(world.lastUser, 'Se esperaba un usuario creado');
  assert.equal(world.lastError, null);
});

Then('debo recibir un usuario con email {string}', async function (this: any, email: string) {
  const world = asWorld.call(this);
  assert.ok(world.lastUser, 'No hay usuario registrado en este escenario');
  assert.equal(world.lastUser.email, email.trim().toLowerCase());
});

Then('la contraseña almacenada no debe ser {string}', async function (
  this: any,
  plainPassword: string
) {
  const world = asWorld.call(this);
  assert.ok(world.lastUser, 'No hay usuario registrado en este escenario');
  const storedUser = await world.container.users.findByEmail(world.lastUser.email);
  assert.ok(storedUser, 'El usuario no está persistido');
  assert.notEqual(storedUser.passwordHash, plainPassword);
});

Then('el registro debe fallar con mensaje {string}', function (this: any, message: string) {
  const world = asWorld.call(this);
  assert.ok(world.lastError, 'Se esperaba un error de registro');
  assert.equal(world.lastError.message, message);
});

Then('debo recibir un token JWT válido', function (this: any) {
  const world = asWorld.call(this);
  assert.ok(world.lastToken, 'No se recibió un token');
  assert.doesNotThrow(() => world.container.tokens.verify(world.lastToken as string));
});

Then('el login debe fallar con mensaje {string}', function (this: any, message: string) {
  const world = asWorld.call(this);
  assert.ok(world.lastError, 'Se esperaba un error de login');
  assert.equal(world.lastError.message, message);
});

Then('la reserva debe confirmarse exitosamente', function (this: any) {
  const world = asWorld.call(this);
  assert.ok(world.lastReservation, 'Se esperaba una reserva confirmada');
  assert.equal(world.lastError, null);
});

Then('la reserva debe fallar con mensaje {string}', function (this: any, message: string) {
  const world = asWorld.call(this);
  assert.ok(world.lastError, 'Se esperaba un error de reserva');
  assert.equal(world.lastError.message, message);
});

Then('la cancelación debe ser exitosa', function (this: any) {
  const world = asWorld.call(this);
  assert.equal(world.lastError, null);
});

Then('la cancelación debe fallar con mensaje {string}', function (this: any, message: string) {
  const world = asWorld.call(this);
  assert.ok(world.lastError, 'Se esperaba un error de cancelación');
  assert.equal(world.lastError.message, message);
});

Then('la eliminación debe fallar con mensaje {string}', function (this: any, message: string) {
  const world = asWorld.call(this);
  assert.ok(world.lastError, 'Se esperaba un error al eliminar la sala');
  assert.equal(world.lastError.message, message);
});

Then('debo ver {int} salas disponibles', function (this: any, expected: number) {
  const world = asWorld.call(this);
  assert.equal(world.lastRooms.length, expected);
});

Then('debo ver {int} sala disponible', function (this: any, expected: number) {
  const world = asWorld.call(this);
  assert.equal(world.lastRooms.length, expected);
});

Then('la sala {string} debe existir', async function (this: any, name: string) {
  const world = asWorld.call(this);
  const room = await world.container.rooms.findByName(name);
  assert.ok(room, `La sala ${name} no existe`);
});

Then('el saldo del usuario {string} debe ser {int}', async function (
  this: any,
  email: string,
  expectedBalance: number
) {
  const world = asWorld.call(this);
  const user = await world.container.users.findByEmail(email.trim().toLowerCase());
  assert.ok(user, `El usuario ${email} no existe`);
  assert.equal(user.balance, expectedBalance);
});
