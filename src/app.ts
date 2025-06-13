import express, { Application } from 'express';
import cors from 'cors';
import { UserRoutes } from './app/modules/user/user.routes';


export const app:Application = express()

// perser middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))   

app.get('/', (req, res) => {
    res.send('Health Check: Server is running!')
})

app.use('/api/v1/user', UserRoutes)