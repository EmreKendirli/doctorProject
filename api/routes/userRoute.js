import FormData from "../middlewares/blogPhotoMiddleware.js"
import express  from "express"
import User from "../controllers/user/userController.js"
import Auth from "../middlewares/userAuthMiddleware.js"
import UserFormData from "../middlewares/officeMiddleware.js"
import PasswordValidation from "../validations/resetPassword.validation.js"
import UserValidate from "../validations/userValidation.js"
const router = express.Router()


router.route("/individual").post(FormData.uploadSettingImages,UserValidate.userCreateValidate,User.individualRegister)
router.route("/doctor").post(FormData.uploadSettingImages,UserValidate.userCreateValidate,User.doctorRegister)
router.route("/login").post(FormData.uploadSettingImages,User.userLogin)
// 
router.route("/user-count").get(FormData.uploadSettingImages,User.userCount)

router.route("/user-filter").post(FormData.uploadSettingImages,User.userFilter)
router.route("/detail").get(Auth.authenticateUserAPIToken,User.userDetail)
router.route("/update").put(Auth.authenticateUserAPIToken,UserFormData.uploadSettingImages,UserFormData.resizeImages,User.userUpdate)
router.route("/update-password").put(Auth.authenticateUserAPIToken,UserFormData.uploadSettingImages,PasswordValidation.resetPasswordDataValidate,User.userPasswordUpdate)
// router.route("/detail/:id").get(UserRole.getDetail)
// router.route("/:id").put(FormData.uploadSettingImages,UserRole.update)

export default router