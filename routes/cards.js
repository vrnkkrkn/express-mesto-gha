const router = require('express').Router();

const {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCard); // возвращает все карточки
router.post('/', createCard); // создаёт карточку
router.delete('/:cardId', deleteCard); // удаляет карточку
router.put('/:cardId/likes', likeCard); // лайк
router.delete('/me/:cardId/likes', dislikeCard); // убрать лайк

module.exports = router;
