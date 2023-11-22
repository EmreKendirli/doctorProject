import FormData from "../middlewares/blogPhotoMiddleware.js"
import express  from "express"
import User from "../controllers/user/userController.js"

const router = express.Router()


router.route("/individual").post(FormData.uploadSettingImages,User.individualRegister)
router.route("/doctor").post(FormData.uploadSettingImages,User.doctorRegister)
router.route("/login").post(FormData.uploadSettingImages,User.userLogin)
// router.route("/").get(UserRole.getAll)
// router.route("/detail/:id").get(UserRole.getDetail)
// router.route("/:id").delete(UserRole.remove)
// router.route("/:id").put(FormData.uploadSettingImages,UserRole.update)

export default router