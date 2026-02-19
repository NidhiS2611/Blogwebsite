const express = require('express');
const router = express.Router();
const { getMyNotifications ,getUnreadCount,markAllAsRead,deleteNotification} = require('../controller/notificationcotroller');
const authmiddle = require('../middleware/authmiddle');
router.get('/getnotification', authmiddle, getMyNotifications);
router.get('/unread-count', authmiddle, getUnreadCount);
router.patch('/mark-all-read', authmiddle, markAllAsRead);
router.delete('/notificationdelete/:id', authmiddle, deleteNotification);
module.exports = router;