// app.js
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';

import config from './config/config.js';
import logger from './utils/logger.js';
import errorHandler from './middlewares/errorHandler.js';

// import clientRoutes from './routes/client.js';
// import documentRoutes from './routes/document.js';
// import reportRoutes from './routes/report.js';

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan logs HTTP to Pino
app.use(morgan('combined', {
  stream: { write: (msg) => logger.info(msg.trim()) }
}));

// app.use('/api/v1/clients', clientRoutes);
// app.use('/api/v1/documents', documentRoutes);
// app.use('/api/v1/reports', reportRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

export default app;
