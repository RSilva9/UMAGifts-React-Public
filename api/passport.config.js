import passport from "passport";
import local from 'passport-local';
import { userModel } from './models/user.model.js'
import { createHash, isValidPassword } from "./utils.js";
import { cartManager } from "./managers/CartManager.js";

const LocalStrategy = local.Strategy
const initializePassport = ()=>{
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, async(req, username, password, done)=>{
            const { first_name, last_name, email, newsletter } = req.body
            try{
                let user = await userModel.findOne({email: username})
                if(user){
                    console.log("El usuario ya existe")
                    return done(null, false)
                }

                let newCart = await cartManager.createCart()
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    password: createHash(password),
                    cartId: newCart.id,
                    newsletter,
                    role: 'user'
                }
                let result = await userModel.create(newUser)
                return done(null, result)
            }catch(err){
                return done("Error al obtener el usuario: " + err)
            }
        }
    ))
    passport.use('login', new LocalStrategy(
        {usernameField: 'email'}, async(username, password, done)=>{
            try{
                const user = await userModel.findOne({email: username})
                if(!user){
                    console.log("El usuario no existe")
                    return done(null, false)
                }
                if(!isValidPassword(user,password)) return done(null, false)
                return done(null, user)
            }catch(err){
                return done(err)
            }
        }
    ))

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })
    passport.deserializeUser(async(id, done)=>{
        let user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport