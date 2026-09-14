import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { CustomWorld } from '../support/world';

Given('que soy administrador', function (this: CustomWorld) {
  this.isAdmin = true;
});

When(
  'creo la sala {string} con capacidad {int} y precio {int}',
  async function (this: CustomWorld, name: string, capacity: number, price: number) {
    try {
      await this.container.manageRoom.create({ name, capacity, price });
    } catch (e) {
      this.lastError = e as Error;
    }
  }
);

When('intento eliminar la sala {string}', async function (this: CustomWorld, name: string) {
  try {
    await this.container.manageRoom.delete(name);
  } catch (e) {
    this.lastError = e as Error;
  }
});

Then('la sala {string} debe existir', async function (this: CustomWorld, name: string) {
  const room = await this.container.rooms.findByName(name);
  assert.ok(room, `La sala ${name} debería existir`);
});

Then('la eliminación debe fallar con mensaje {string}', function (this: CustomWorld, msg: string) {
  assert.ok(this.lastError);
  assert.strictEqual(this.lastError?.message, msg);
});