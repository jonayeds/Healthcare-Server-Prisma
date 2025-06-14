import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { indexRoute } from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';



export const app:Application = express()

// perser middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))   

app.get('/', (req, res) => {
    res.send('Health Check: Server is running!')
})
app.use('/api/v1', indexRoute)

app.use(globalErrorHandler)
