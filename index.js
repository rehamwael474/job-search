import path from 'path'
import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './db/connection.js'
import { initApp } from './src/initApp.js'
const app = express()
const port = 3000
dotenv.config({path: path.resolve('./config/.env')})
console.log(process.env.DB_URL)
// connect db
connectDB()
initApp(app,express)
app.listen(port,() => console.log(`app listening on port ${port}!`))