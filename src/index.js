import './db';
import './models/User';
import express from 'express';
import morgan from 'morgan';
import userRouter from './router/userRouter';
import { localMiddlewares } from './middlewares';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';

const app = express();
const PORT = 8888;
const logger = morgan('dev');

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(
  session({
    secret: 'Hello',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: 'mongodb://127.0.0.1:27017/promptopia',
    }),
  }),
);

app.use(localMiddlewares);
app.get('/', (req, res) => {
  return res.send({ message: 'Hello World' });
});

app.use('/api/v1/user', userRouter);

const handelListening = () => {
  console.log(`✅Server is running on http://localhost:${PORT}`);
};
app.listen(PORT, handelListening);
