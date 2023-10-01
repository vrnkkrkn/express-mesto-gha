const router = require('express').Router();

const {
  getUser, getUserId, createUser, updateProfile, updateAvatar,
} = require('../controllers/users');

router.get('/', getUser); // возвращает всех пользователей
router.get('/:userId', getUserId); // возвращает пользователя по _id
router.post('/', createUser); // создаёт пользователя
router.patch('/me', updateProfile); // обновляет профиль
router.patch('/me/avatar', updateAvatar); // обновляет аватар

module.exports = router;
