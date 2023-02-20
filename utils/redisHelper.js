import redis from "redis";

let redisClient;

(async () => {
  redisClient = redis.createClient(6379);

  redisClient.on("error", (err) => {
    console.log("Redis Error " + err);
  });
  await redisClient.connect();
})();

const setCache = async function (key, obj, maxAge) {
  try {
    await redisClient.set(key, JSON.stringify(obj));
    await redisClient.expire(key, maxAge);
  } catch (err) {
    console.log(err.message);
  }
};

const setCacheObjByKey = async function (key, objKey, objValue, maxAge) {
  try {
    const cacheObjJson = await redisClient.get(key);
    if (cacheObjJson) {
      const cacheObj = JSON.parse(cacheObjJson);
      cacheObj[objKey] = objValue;
      await redisClient.set(key, JSON.stringify(cacheObj));
      await redisClient.expire(key, maxAge);
    } else {
      const cacheObj = {};
      cacheObj[objKey] = objValue;
      await redisClient.set(key, JSON.stringify(cacheObj));
      await redisClient.expire(key, maxAge);
    }
  } catch (err) {
    console.log(err.message);
  }
};

const checkSessionCache = async function (key, value) {
  try {
    const cacheObjJson = await redisClient.get(key);
    if (cacheObjJson) {
      const cacheObj = JSON.parse(cacheObjJson);
      if (value === cacheObj.sessionId) {
        return true;
      }
    } else {
      return false;
    }
  } catch (err) {
    console.log(err.message);
  }
};

const getPasswordAttempsCache = async function (key) {
  try {
    const cacheObjJson = await redisClient.get(key);
    if (cacheObjJson) {
      const cacheObj = JSON.parse(cacheObjJson);
      if (cacheObj.passwordAttemps) {
        return cacheObj.passwordAttemps;
      }
    } else {
      return 0;
    }
  } catch (err) {
    console.log(err.message);
  }
};

const clearCache = function (key) {
  redisClient.del(key);
};

export default {
  setCache,
  setCacheObjByKey,
  checkSessionCache,
  getPasswordAttempsCache,
  clearCache,
};
