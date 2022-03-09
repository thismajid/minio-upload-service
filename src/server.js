import fastify from 'fastify';
import dotEnv from 'dotenv';

import App from './app';

dotEnv.config();
const app = new App(fastify({ logger: false }));

app.serve();
