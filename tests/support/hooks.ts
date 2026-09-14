import { Before, After, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';

Before(function (this: CustomWorld) {
  this.reset();
});

After(function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.lastError) {
    console.error('❌ Error en escenario:', this.lastError.message);
  }
});