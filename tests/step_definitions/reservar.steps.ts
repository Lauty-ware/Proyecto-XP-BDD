import { When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { CustomWorld } from '../support/world';

When(
  '{string} reserva la sala {string} para el día {string}',
  async function (this: CustomWorld, email: string, roomName: string, date: string) {
    try {
      this.lastReservation = await this.container.reserveRoom.execute({
        userEmail: email,
        roomName,
        date
      });
    } catch (e) {
      this.lastError = e as Error;
    }
  }
);

Then('la reserva debe confirmarse exitosamente', function (this: CustomWorld) {
  assert.strictEqual(this.lastError, null, this.lastError?.message);
  assert.ok(this.lastReservation);
});

Then(
  'el saldo del usuario {string} debe ser {int}',
  async function (this: CustomWorld, email: string, expected: number) {
    const user = await this.container.users.findByEmail(email);
    assert.strictEqual(user?.balance, expected);
  }
);

Then('la reserva debe fallar con mensaje {string}', function (this: CustomWorld, msg: string) {
  assert.ok(this.lastError, 'Se esperaba error de reserva');
  assert.strictEqual(this.lastError?.message, msg);
});