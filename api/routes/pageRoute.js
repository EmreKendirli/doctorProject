import express  from "express";
import * as page  from "../controllers/pageController.js";

const router =express.Router()
router.route("/").get(page.getHomePage)
router.route("/iletisim").get(page.getContactPage)
router.route("/hakkimizda").get(page.getAboutPage)
router.route("/blog").get(page.getBlogPage)
router.route("/blog-detail/:seourl").get(page.getBlogDetailPage)
router.route("/course").get(page.getCoursePage)
router.route("/course-detail/:seourl").get(page.getCourseDetailPage)
router.route("/faq").get(page.getFaqPage)

export default router