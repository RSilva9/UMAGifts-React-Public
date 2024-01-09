import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth:{
        user: process.env.UMA_EMAIL,
        pass: process.env.NODEMAILER_KEY
    }
})