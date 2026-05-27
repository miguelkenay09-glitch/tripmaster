import { Pool } from 'pg';
import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL Connection Pool
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pgPool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Redis Connection
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis connected'));

// Connect Redis
(async () => {
  await redisClient.connect();
})();

export { pgPool, redisClient };
