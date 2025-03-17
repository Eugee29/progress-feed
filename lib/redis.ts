import { createClient } from "redis";

const redis = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "0"),
  },
});

redis.on("error", (err) => console.error("Redis Client Error", err));

if (!redis.isOpen) redis.connect();

export { redis };
