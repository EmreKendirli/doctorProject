import express  from "express";
import * as Blog  from "../controllers/blogController.js";
import blogPhotoMiddleware from "../middlewares/blogPhotoMiddleware.js";
import Auth from "../middlewares/userAuthMiddleware.js"

const router =express.Router()

router.route("/").get(Blog.getAll)
router.route("/list/all").get(Blog.getListAll)
router.route("/").post(Auth.authenticateUserAPIToken,blogPhotoMiddleware.uploadSettingImages,blogPhotoMiddleware.resizeImages,Blog.create)
router.route("/:id").get(Blog.getDetail)
router.route("/:id").delete(Blog.remove)
router.route("/:id").put(Auth.authenticateUserAPIToken,blogPhotoMiddleware.uploadSettingImages,blogPhotoMiddleware.resizeImages,Blog.update)
router.route("user-blog").get(Auth.authenticateUserAPIToken,Blog.getUserData)
export default router