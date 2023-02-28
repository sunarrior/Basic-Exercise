import redis from "redis";

let redisClient;

(async () => {
  redisClient = redis.createClient({ legacyMode: true });

  redisClient.on("error", (err) => {
    console.log("Redis Error " + err);
  });
  await redisClient.connect();
})();

const getRedisClient = function () {
  return redisClient;
};

const setCache = async function (key, value, maxAge) {
  try {
    await redisClient.set(key, value);
    await redisClient.expire(key, maxAge);
  } catch (err) {
    console.log(err);
  }
};

const getCache = async function (key) {
  try {
    return new Promise((resolve, reject) => {
      redisClient.get(key, (err, data) => {
        resolve(data);
      });
    });
  } catch (err) {
    console.log(err);
  }
};

const clearCache = function (key) {
  redisClient.del(key);
};

export default {
  getRedisClient,
  setCache,
  getCache,
  clearCache,
};
