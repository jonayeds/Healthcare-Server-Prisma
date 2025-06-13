import express, { Application } from 'express';
import cors from 'cors';
import { UserRoutes } from './app/modules/user/user.routes';


export const app:Application = express()

app.use(cors())

app.get('/', (req, res) => {
    res.send('Health Check: Server is running!')
})

app.use('/api/v1/user', UserRoutes)