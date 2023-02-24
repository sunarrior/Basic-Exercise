import redis from "redis";

let redisClient;

(async () => {
  redisClient = redis.createClient(6379);

  redisClient.on("error", (err) => {
    console.log("Redis Error " + err);
  });
  await redisClient.connect();
})();

const setObjByKey = async function (key, objKey, objValue, maxAge) {
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
    console.log(err);
  }
};

const checkObjByKey = async function (key, objKey, objValue) {
  try {
    const cacheObjJson = await redisClient.get(key);
    if (cacheObjJson) {
      const cacheObj = JSON.parse(cacheObjJson);
      if (objValue === cacheObj[objKey]) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

const getPasswdAttemps = async function (key) {
  try {
    const cacheObjJson = await redisClient.get(key);
    if (cacheObjJson) {
      const cacheObj = JSON.parse(cacheObjJson);
      if (cacheObj.passwdAttemps) {
        return cacheObj.passwdAttemps;
      }
      return 0;
    } else {
      return 0;
    }
  } catch (err) {
    console.log(err);
  }
};

const clearCache = function (key) {
  redisClient.del(key);
};

export default {
  setObjByKey,
  checkObjByKey,
  getPasswdAttemps,
  clearCache,
};
