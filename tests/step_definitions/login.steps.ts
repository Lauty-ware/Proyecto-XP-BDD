import { When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { CustomWorld } from '../support/world';

When(
  'inicio sesión con email {string} y contraseña {string}',
  async function (this: CustomWorld, email: string, password: string) {
    try {
      const result = await this.container.loginUser.execute(email, password);
      this.lastToken = result.token;
      this.lastUser = { email: result.user.email, id: result.user.id };
    } catch (e) {
      this.lastError = e as Error;
    }
  }
);

Then('debo recibir un token JWT válido', function (this: CustomWorld) {
  assert.ok(this.lastToken, 'Se esperaba token');
  const payload = this.container.tokens.verify(this.lastToken!);
  assert.ok(payload.sub);
});

Then('el login debe fallar con mensaje {string}', function (this: CustomWorld, msg: string) {
  assert.ok(this.lastError);
  assert.strictEqual(this.lastError?.message, msg);
});