import dotenv from 'dotenv'
dotenv.config()

export const credentials = {
    db_user: process.env.DB_USER,
    db_pass: process.env.DB_PASS,
    secret: process.env.SECRET
}