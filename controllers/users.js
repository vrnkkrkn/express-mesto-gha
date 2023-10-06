const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  CreatedCode,
} = require('../errors/errors');

/** создать пользователя */
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User
        .create({
          name, about, avatar, email, password: hash,
        })
        .then((user) => res.status(CreatedCode).send({
          name: user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные '));
          } else {
            next(err);
          }
        });
    });
};

/** возвращает всех пользователей */
module.exports.getUser = (req, res, next) => {
  User
    .find({})
    .then((users) => res.send(users))
    .catch(next);
};

/** возвращает пользователя по _id */
module.exports.getUserId = (req, res, next) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

/** обновить профиль */
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

/** обновить аватар */
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  return User
    .findUserByCredentials(email, password)
    .then((user) => {
      /** создадим токен */
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });

      /** вернём токен */
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

/** возвращает информацию о текущем пользователе */
module.exports.getCurrentUser = (req, res, next) => {
  console.log(req.user._id);
  User
    .findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};
