import express from 'express';
import { env } from './config/env';
import { buildContainer } from './container';
import { buildRouter } from './interfaces/http/routes';
import { errorMiddleware } from './interfaces/http/middlewares/errorMiddleware';

const app = express();
app.use(express.json());

const container = buildContainer(env);
app.use('/api', buildRouter(container));
app.use(errorMiddleware);

app.listen(env.port, () => {
  console.log(`CoworkingHub escuchando en http://localhost:${env.port}/api`);
});
