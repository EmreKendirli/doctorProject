import express  from "express"
import AdminController from "../controllers/user/adminController.js"
import FormData from "../middlewares/blogPhotoMiddleware.js"
import Auth from "../middlewares/userAuthMiddleware.js"
const router = express.Router()

router.route("/login").post(FormData.uploadSettingImages,AdminController.loginAdmin)
router.route("/register").post(FormData.uploadSettingImages,AdminController.registerAdmin)
router.route("/doctor-list").get(Auth.authenticateAdminAPIToken,AdminController.doctorList)

export default router
