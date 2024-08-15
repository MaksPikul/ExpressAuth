const Redis = require("ioredis")


async function getRedisClient(){
    let redisClient;

    if (!redisClient){
        redisClient = new Redis()

        redisClient.on(
            'error', 
            err => console.log('Redis Client Error', err))
        
        //await redisClient.connect();
    }
    //console.log(redisClient)
    return redisClient;
}

module.exports = getRedisClient