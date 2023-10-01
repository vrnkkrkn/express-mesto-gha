/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

/** создать карточку */
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card
    .create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

/** получить созданные карточки */
module.exports.getCard = (req, res) => {
  Card
    .find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла  ошибка' }));
};

/** удаление карточки */
module.exports.deleteCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card
      .findByIdAndRemove(req.params.cardId)
      // eslint-disable-next-line consistent-return
      .then((card) => {
        if (!card) {
          return res.status(404).send({ message: 'Карточка не найдена' });
        }
        res.send({ message: 'Карточка удалена' });
      })
      .catch(() => res.status(404).send({ message: 'Карточка не найдена' }));
  } else {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }
};

/** лайк */
module.exports.likeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card
      .findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
      // eslint-disable-next-line consistent-return
      .then((card) => {
        if (!card) {
          return res.status(404).send({ message: 'Карточка не найдена' });
        }
        res.send({ card, message: 'Лайк поставлен' });
      })
      .catch(() => res.status(404).send({ message: 'Карточка не найдена' }));
  } else {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }
};

/** убрать лайк */
module.exports.dislikeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card
      .findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
      // eslint-disable-next-line consistent-return
      .then((card) => {
        if (!card) {
          return res.status(404).send({ message: 'Карточка не найдена' });
        }
        res.send({ card, message: 'Лайк удален' });
      })
      .catch(() => res.status(404).send({ message: 'Карточка не найдена' }));
  } else {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }
};
