const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const { IntervalServerError, NotFoundError } = require('./errors/errors');

const app = express();

/** подключаемся к серверу mongo */
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

/** авторизация */
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
/** обработчики ошибок */
app.use(errors());
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use((err, req, res, next) => {
  /** если у ошибки нет статуса, выставляем 500 */
  const { statusCode = IntervalServerError, message } = err;

  res
    .status(statusCode)
    .send({
      /** проверяем статус и выставляем сообщение в зависимости от него */
      message: statusCode === IntervalServerError
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

/** подключаем мидлвары, роуты и всё остальное */
app.listen(PORT);
