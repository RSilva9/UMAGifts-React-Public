import express from "express"
import mongoose from "mongoose"
import { Server } from "socket.io"
import { boxRouter } from "./routes/box.router.js"
import { productRouter } from "./routes/product.router.js"
import { cartRouter } from "./routes/cart.router.js"
import { userRouter } from "./routes/user.router.js"
import { adminRouter } from "./routes/admin.router.js"
import { orderRouter } from "./routes/order.router.js"
import passport from "passport"
import initializePassport from "./passport.config.js"
import cors from 'cors'
import MongoStore from "connect-mongo"
import session from "express-session"
import dotenv from 'dotenv'
dotenv.config()

const hostname = '0.0.0.0'
const port = '10000'

export var app = express()
const httpServer = app.listen(port, hostname, ()=>{ console.log("Server Up")})
// const httpServer = app.listen(8080, ()=>{ console.log("Server Up")})
export const socketServer = new Server(httpServer)

initializePassport()

const corsOptions = {
    origin: ['http://localhost:3000', 'https://effervescent-baklava-78de89.netlify.app',
     'https://uma-react-ng8scr1up-rsilva9.vercel.app', 'https://uma-react-delta.vercel.app', 'https://umagifts.com.ar', 'https://www.umagifts.com.ar'],
    credentials: true
}

app.set('trust proxy', 1)
app.use(cors(corsOptions));
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 15
    }),
    secret: 'or1t0_Or1To',
    resave: true,
    saveUnitialized: false,
    cookie:{
        // maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: 'none'
    }
}))

app.use(passport.initialize())
app.use(passport.session())

function setCookieMaxAge(req, res, next) {
    if (req.isAuthenticated()) {
        req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000
    } else {
        req.session.cookie.maxAge = 10 * 60 * 1000
    }
    next();
}

app.use(setCookieMaxAge);
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/api/boxes', boxRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/users', userRouter)
app.use('/api/admin', adminRouter)
app.use('/api/orders', orderRouter)

var connectionString = process.env.MONGO_URL
mongoose.set('strictQuery', false)
mongoose.connect(connectionString)

socketServer.on('connection', socket=>{
    console.log("Nuevo cliente conectado.")
})