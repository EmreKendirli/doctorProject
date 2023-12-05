import express  from "express";
import ChatController from "../controllers/chat/chatController.js";
import FormData from "../middlewares/blogPhotoMiddleware.js"
import Auth from "../middlewares/userAuthMiddleware.js"
const router =express.Router()

router.route("/send-message").post(Auth.authenticateUserAPIToken,FormData.uploadSettingImages,ChatController.sendMessage)
router.route("/message-list/:conversationId").get(Auth.authenticateUserAPIToken,ChatController.getmessagesBetweenUsersFor)
router.route("/user-list").get(Auth.authenticateUserAPIToken,ChatController.bringThePeopleITexted)
export default router
