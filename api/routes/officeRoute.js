import express  from "express"
import Office from "../controllers/officeController.js"

const router = express.Router()


router.route("/detail/:id").get(Office.officeDetail)

export default router