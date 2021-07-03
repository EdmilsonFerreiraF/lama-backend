import express, { Express } from 'express';
import cors from 'cors';

import { userRouter } from './controller/routes/UserRouter';
import { musicRouter } from './controller/routes/MusicRouter';

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use('/user', userRouter);
app.use('/music', musicRouter);

let port: any = process.env.PORT;

if (port == null || port == "") {
  port = 8000;
}

app.listen(port);