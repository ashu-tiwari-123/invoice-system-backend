const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_DB_CONNECTION_URI || "mongodb+srv://ashutoshtiwari98560:ashutosh123@invoicesystem.9e2c5z1.mongodb.net/?retryWrites=true&w=majority&appName=InvoiceSystem",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  jwtSecret: process.env.JWT_SECRET || 'your-super-long-secret',
};

export default config;
