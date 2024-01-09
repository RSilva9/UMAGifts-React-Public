import { Router } from 'express';
import passport from 'passport';
import { userModel } from '../models/user.model.js'

export const userRouter = Router()

function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === "admin") {
      return next();
    }
    return res.status(403).send("Acceso denegado. No tienes permisos de administrador.");
}

export function isLoggedIn(req, res, next){
    if(req.session.user){
        return next()
    }
    return res.status(401).send('Error de autorización.')
}

userRouter.get('/', async(req, res)=>{
    try {
        const users = await userModel.find({})
        res.status(200).send(users)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

userRouter.post('/register', passport.authenticate('register', {}), async (req, res)=>{
    try {
        res.send('Success')
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

userRouter.post('/login', passport.authenticate('login', {}), async (req, res)=>{
    try {
        if(!req.user){
            return res.status(401)
        }
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            role: req.user.role,
            cartId: req.user.cartId
        }
        res.send('Success')
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

userRouter.get('/logout', (req, res)=>{
    try {
        req.session.destroy(err=>{
            if(err) res.status(500)
        })
        res.send('Logged out')
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

userRouter.get('/check-login', isLoggedIn, (req, res) => {
    try {
        res.status(200).send('Usuario logueado');
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
});

userRouter.get('/getUser', (req, res)=>{
    try {
        if(req.session.user){
            res.status(200).json(req.session.user);
        }else{
            res.status(400).send({
                status: 'error',
                message: "Not found"
            })
        }
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

// userRouter.put('/changeRole/:userId', isAdmin, async(req, res)=>{
//     try {
//         const userId = req.params.userId
//         const fetchedUser = await userModel.findById(userId)
//         fetchedUser.role == "user" ? fetchedUser.role = "admin" : fetchedUser.role = "user"
//         await fetchedUser.save()
//         res.status(200).json(`User ${fetchedUser._id} role changed.`)
//     } catch (error) {
//         res.status(400).send({
//             status: 'error',
//             message: error.message
//         })
//     }
// })

userRouter.delete('/:userId', isAdmin, async(req, res)=>{
    try {
        const userId = req.params.userId
        await userModel.findByIdAndDelete(userId)
        res.status(200).json(`User deleted.`)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})