const express = require("express")
const { Server } = require("socket.io")
//created app which enables HTTP requests
const app = express(); 
const session = require("express-session")
const server = require("http").createServer(app);
const Redis = require("ioredis")
const redisStore = require("connect-redis").default;
const helmet = require("helmet");
const cors  = require("cors");
const authRouter = require("./routers/authRouter")
require("dotenv").config()

const io = new Server(server, {
    cors: {
        origin:"http://localhost:3000",
        credentials: "true",
    }
})
const redisClient = new Redis();



//Created a server, this will allow for bi-directional communication
//between server and client


//if im using redis, the port will be 6379

//middle ware for security, sets various http headers to protect againsts well known
//web vulnerabilities 
app.use(helmet())

//specifies which origins are allowed to access server, prevents cross-site 
//request forgery
app.use(cors({
    origin: "http://localhost:3000",
    credentials:true,
}))

//allows parsing of json bodies
app.use(express.json())

//allows for cookies, saves user state, keeps people logged in
app.use(session({
    secret: "dog",//process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
    //store: new redisStore({client: redisClient}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,//process.env.ENVIRONMENT === "production" ? "true" : "auto",
        httpOnly: true,
        expires:   1000 * 60 * 60 * 24 * 7,
        sameSite: "lax"//process.env.ENVIRONMENT === "production" ? "true" : "lax"
    }
    
}))

//handles routes
app.use("/auth", authRouter);


//handles events when client connects (in login, file will ask to connect)
io.on("connect", socket => {});

//listens for requests to connect to server
server.listen(4000, ()=>{
    console.log("Server listening on port 4000");
})