import express, { Express } from 'express';
import cors from 'cors';

import { userRouter } from './controller/routes/UserRouter';
import { musicRouter } from './controller/routes/MusicRouter';

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.use('/user', userRouter);
app.use('/music', musicRouter);

app.listen(process.env.DB_PORT || 3003, () => {
    console.log("Servidor rodando na porta 3003");
})