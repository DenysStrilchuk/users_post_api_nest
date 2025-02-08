import * as process from "process";

export default () => ({
  mongoUri: process.env.MONGO_URI ?? (() => {
    throw new Error('MONGO_URI is not defined');
  })(),
  jwtSecret: process.env.JWT_SECRET ?? (() => {
    throw new Error('JWT_SECRET is not defined');
  })(),
  jwtExpiresIn: '1h',
});
