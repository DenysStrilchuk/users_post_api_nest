import * as dotenv from 'dotenv';
import * as process from "process";

const environment = process.env.APP_ENVIRONMENT || 'local';
dotenv.config({ path: `environments/${environment}.env` });

export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  mongoUri: process.env.MONGO_URI ?? (() => {
    throw new Error('MONGO_URI is not defined');
  })(),
  jwtSecret: process.env.JWT_SECRET ?? (() => {
    throw new Error('JWT_SECRET is not defined');
  })(),
  jwtExpiresIn: '1h',
});
