const redisClient = require("./redis")

//bucket 
module.exports.rateLimit = async (req, res, next) => {
    const ip = req.ip
    const [response] = await redisClient
    .multi()
    .incr(ip)
    .expire(ip, 60)
    .exec();

    if (response[1] > 5){
        res.json({
            error: "You have reached login limit, Try again later"
        })
    }
    else {
        next()
    }
}