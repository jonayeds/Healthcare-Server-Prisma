import express, { Application } from 'express';
import cors from 'cors';

export const app:Application = express()

app.use(cors())

app.get('/', (req, res) => {
    res.send('Health Check: Server is running!')
})
