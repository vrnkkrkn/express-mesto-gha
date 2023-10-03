const User = require('../models/user');

const {
  BadRequestError,
  NotFoundError,
} = require('../errors/errors');

/** создать пользователя */
module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User
    .create({ name, about, avatar })
    .then((user) => res.status(201).send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError' || (err.name === 'CastError')) {
        next(new BadRequestError(`Переданы некорректные данные -- ${err.name}`));
      } else {
        next(err);
      }
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
        next(new BadRequestError(`Переданы некорректные данные  -- ${err.name}`));
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
        next(new BadRequestError(`Переданы некорректные данные  -- ${err.name}`));
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
        next(new BadRequestError(`Переданы некорректные данные -- ${err.name}`));
      } else {
        next(err);
      }
    });
};
