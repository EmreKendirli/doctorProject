import express  from "express";
import * as page  from "../controllers/pageController.js";

const router =express.Router()
router.route("/doctor-key").get(page.getDoctorFilterKey)
router.route("/blog-key").get(page.getBlogFilterKey)

export default router