import './db';
import './models/Prompt';
import User from './models/User';
import express, { urlencoded } from 'express';
import morgan from 'morgan';
import userRouter from './router/userRouter';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import promptRouter from './router/promptRouter';
import passport from 'passport';
import passLoc from 'passport-local';

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
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: 'mongodb://127.0.0.1:27017/promptopia',
    }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  done(null, id);
});

passport.use(
  new passLoc.Strategy(async function (username, password, done) {
    const user = await User.findOne({ username: username, password: password });
    if (user) {
      return done(null, user);
    }
    function validation(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    }
  }),
);

app.get('/', (req, res) => {
  return res.send({ message: 'Hello World' });
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/prompt', promptRouter);

const handelListening = () => {
  console.log(`✅Server is running on http://localhost:${PORT}`);
};
app.listen(PORT, handelListening);
