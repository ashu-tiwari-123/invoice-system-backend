// index.js
import dotenv from 'dotenv';
dotenv.config();

import logger from './utils/logger.js'
import config from './config/config.js';
import { connectDB, disconnectDB } from './config/mongoDB.js';
import app from './app.js';

let server;

process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION! ${err.stack || err}`);
  process.exit(1);
});

const run = async () => {
  await connectDB();
  server = app.listen(config.port, () => {
    logger.info(`Server listening on port ${config.port} [${config.env}]`);
  });
};

run().catch((err) => {
  logger.error('Startup error:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION! ${err.stack || err}`);
  shutdown();
});

const shutdown = () => {
  logger.info('Shutting down gracefully...');
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
