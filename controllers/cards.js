const Card = require('../models/card');

const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  CreatedCode,
} = require('../errors/errors');

/** создать карточку */
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card
    .create({ name, link, owner })
    .then((card) => res.status(CreatedCode).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

/** получить созданные карточки */
module.exports.getCard = (req, res, next) => {
  Card
    .find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

/** удаление карточки */
module.exports.deleteCard = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Карточка создана другим пользователем'));
      }
      return res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

/** лайк */
module.exports.likeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => { res.send(card); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        console.log('here');
        next(err);
      }
    });
};

/** убрать лайк */
module.exports.dislikeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => { res.send(card); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
