import http from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { initSocket } from './server/socket';

const app = createApp();
const server = http.createServer(app);
initSocket(server);

server.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});