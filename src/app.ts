import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { indexRoute } from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import  httpStatus from 'http-status';
import cookieParser from 'cookie-parser';


export const app:Application = express()

// perser middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))  
app.use(cookieParser()) 

app.get('/', (req, res) => {
    res.send('Health Check: Server is running!')
})
app.use('/api/v1', indexRoute)

app.use(globalErrorHandler)

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'API Not Found',
        error:{
            path: req.originalUrl,
        }
    });
}); 
