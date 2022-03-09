import fastify from 'fastify';
import dotenv from 'dotenv';

import App from './app';

dotenv.config();
const app = new App(fastify({ logger: false }));

app.serve();
