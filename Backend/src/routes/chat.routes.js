const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const chatControllers = require('../controllers/chat.controllers');



const router = express.Router();

router.post('/',authMiddleware.authUser,chatControllers.createChat);
router.get('/',authMiddleware.authUser,chatControllers.getChat);
router.delete('/:id',authMiddleware.authUser,chatControllers.deleteChat);
router.patch('/:id',authMiddleware.authUser,chatControllers.renameChat);

module.exports = router;