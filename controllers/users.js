const User = require('../models/user');

/** создать пользователя */
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User
    .create({ name, about, avatar })
    .then((user) => res.send({ name: user.name, about: user.about, avatar: user.avatar }))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

/** возвращает всех пользователей */
module.exports.getUser = (req, res) => {
  User
    .find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

/** возвращает пользователя по _id */
module.exports.getUserId = (req, res) => {
  if (req.params.userId.length === 24) {
    User
      .findById(req.params.userId)
      // eslint-disable-next-line consistent-return
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: 'Пользователь не найден' });
        }
        res.send(user);
      })
      .catch(() => res.status(404).send({ message: 'Пользователь не найден' }));
  } else {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }
};

/** обновить профиль */
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  if (req.user._id) {
    User
      // eslint-disable-next-line no-underscore-dangle
      .findByIdAndUpdate(req.user._id, { name, about })
      // eslint-disable-next-line consistent-return
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: 'Пользователь не найден' });
        }
        res.send(user);
      })
      .catch((err) => {
        if (err.name === 'SomeErrorName') {
          res.status(400).send({ message: 'Переданы некорректные данные' });
        } else {
          res.status(404).send({ message: 'Пользователь не найден' });
        }
      });
  } else {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

/** обновить аватар */
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  if (req.user._id) {
    User
      // eslint-disable-next-line no-underscore-dangle
      .findByIdAndUpdate(req.user._id, { avatar })
      // eslint-disable-next-line consistent-return
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: 'Пользователь не найден' });
        }
        res.send(user);
      })
      .catch((err) => {
        if (err.name === 'SomeErrorName') {
          res.status(400).send({ message: 'Переданы некорректные данные' });
        } else {
          res.status(404).send({ message: 'Пользователь не найден' });
        }
      });
  } else {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};
