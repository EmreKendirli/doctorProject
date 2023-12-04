import Appointment from "../models/appointmentModel.js";
import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appError.js"
import axios from "axios"
const create = tryCatch(async (req,res)=>{
    let obj = {
        patientId:req.user._id,
        doctorId:req.body.doctorId,
        dateTime:req.body.dateTime
    }

    const create = await Appointment.create(obj)
    if (!create) {
        throw new AppError("Randevu oluşturmada hata oluştu",404)
    }
    res.status(200).json({
        succeded:true,
        data:create,
        message:"Randevu Talebiniz Alınmıştır."
    })
})
const bringDoctorActiveAppointments = tryCatch(async (req,res)=>{
    const id =req.user._id//"656afd7d77f784f999b67eb8" 

    const data = await Appointment.find({doctorId:id}).populate({path:"patientId",select:"firstName lastName email"})
    res.status(200).json({
        succeded:true,
        data
    })
})
const bringPatientActiveAppointments = tryCatch(async (req,res)=>{
    const id =req.user._id//"656afd7d77f784f999b67eb8" 

    const data = await Appointment.find({patientId:id}).populate({path:"doctorId",select:"firstName lastName email"})
    res.status(200).json({
        succeded:true,
        data
    })
})
const Appointments = {
    create,
    bringDoctorActiveAppointments,
    bringPatientActiveAppointments
}
export default Appointments