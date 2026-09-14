import { When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { CustomWorld } from '../support/world';

When(
  'me registro con email {string} y contraseña {string}',
  async function (this: CustomWorld, email: string, password: string) {
    try {
      const user = await this.container.registerUser.execute({ email, password });
      this.lastUser = { email: user.email, id: user.id };
      const stored = await this.container.users.findByEmail(email);
      (this as CustomWorld & { storedHash?: string }).storedHash = stored?.passwordHash;
    } catch (e) {
      this.lastError = e as Error;
    }
  }
);

Then('el registro debe ser exitoso', function (this: CustomWorld) {
  assert.strictEqual(this.lastError, null, `Error inesperado: ${this.lastError?.message}`);
  assert.ok(this.lastUser);
});

Then('debo recibir un usuario con email {string}', function (this: CustomWorld, email: string) {
  assert.strictEqual(this.lastUser?.email, email);
});

Then('la contraseña almacenada no debe ser {string}', function (this: CustomWorld, plain: string) {
  const storedHash = (this as CustomWorld & { storedHash?: string }).storedHash;
  assert.ok(storedHash);
  assert.notStrictEqual(storedHash, plain);
});

Then('el registro debe fallar con mensaje {string}', function (this: CustomWorld, msg: string) {
  assert.ok(this.lastError, 'Se esperaba un error');
  assert.strictEqual(this.lastError?.message, msg);
});