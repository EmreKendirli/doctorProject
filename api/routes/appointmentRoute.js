import express  from "express";
import FormData from "../middlewares/blogPhotoMiddleware.js"
import Appointment from "../controllers/appointmentController.js";
import Auth from  "../middlewares/userAuthMiddleware.js"
const router =express.Router()

router.route("/").post(Auth.authenticatePatientAPIToken,FormData.uploadSettingImages,Appointment.create)
router.route("/doctor-list").get(Auth.authenticateUserDoctorAPIToken,Appointment.bringDoctorActiveAppointments)
router.route("/patient-list").get(Auth.authenticatePatientAPIToken,Appointment.bringPatientActiveAppointments)
router.route("/:id").delete(Auth.authenticateUserDoctorAPIToken,Appointment.deleteAppointment)

router.route("/doctor-hours-list/:id").get(Appointment.doctorAppointmentHours)

export default router
 