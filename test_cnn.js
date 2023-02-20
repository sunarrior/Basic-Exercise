import redis from "redis";

let redisClient;

(async () => {
  redisClient = redis.createClient(6379);

  redisClient.on("error", (err) => {
    console.log("Redis Error " + err);
  });
  await redisClient.connect();
})();

redisClient.set("test", "test");
redisClient.expire("test", 60);
