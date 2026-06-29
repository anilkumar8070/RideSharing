const express = require('express');
const { 
    getNotifications, 
    getUnreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
} = require('../controllers/notification.ctrl');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getNotifications);
router.get('/unread/count', protect, getUnreadCount);
router.patch('/:id/read', protect, markAsRead);
router.patch('/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
