import './db';
import './models/User';
import express, { urlencoded } from 'express';
import morgan from 'morgan';
import userRouter from './router/userRouter';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 8888;
const logger = morgan('dev');

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(logger);
app.use(cookieParser());
app.use(
  session({
    secret: 'Hello',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb://127.0.0.1:27017/promptopia',
    }),
  }),
);

app.get('/', (req, res) => {
  return res.send({ message: 'Hello World' });
});

app.use('/api/v1/user', userRouter);

const handelListening = () => {
  console.log(`✅Server is running on http://localhost:${PORT}`);
};
app.listen(PORT, handelListening);
