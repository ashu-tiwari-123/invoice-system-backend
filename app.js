// app.js
import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";

import config from "./config/config.js";
import logger from "./utils/logger.js";
import errorHandler from "./middlewares/errorHandler.js";

import authRoute from "./routes/authRoute.js";

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan logs HTTP to Pino
app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

app.use("/api/v1/user", authRoute);

app.use((req, res, next) => {
  res.status(404).json({message:"Welcome to Invoice Backend"});
});

app.use(errorHandler);

export default app;
