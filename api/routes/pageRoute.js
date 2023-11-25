import express  from "express";
import * as page  from "../controllers/pageController.js";

const router =express.Router()
router.route("/doctor-key").get(page.getDoctorFilterKey)

export default router