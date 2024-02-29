const Notifications = require("express").Router();
const authCheck = require("../middleware/middleware");
const LikesFiles = require("../models").LikesFiles;
// const ViewsFiles = require("../models").ViewsFiles;
const NotificationController = require("../controller/notifications");

/**
 * @openapi
 * '/api/notifications/getNotifications':
 *  get:
 *     tags:
 *     - Notifications
 *     summary: Get the list of Notifications for a user.
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *                     currentPage:
 *                       type: number
 *                 status:
 *                   type: boolean
 *                  
 */
Notifications.get("/getNotifications", authCheck.jwtToken, NotificationController.getNotifications);
module.exports = Notifications;
