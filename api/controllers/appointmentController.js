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
console.log(obj,"5545");
    const create = await Appointment.create(obj)
    if (!create) {
        throw new AppError("Randevu oluşturmada hata oluştu",404)
    }
    console.log(create,"//");
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
const doctorAppointmentHours = tryCatch (async (req,res)=>{
    const id = req.params.id

    const currentDate  = new Date();
    let filter = {
        doctorId:id,
        dateTime: { $gt: currentDate }
    }
    const data = await Appointment.find(filter)
    let dateTimeData = []
    if (data.length>0) {
        for(const i of data){
            dateTimeData.push(i.dateTime)
        }
    }
    const formattedDates = dateTimeData.map(originalDate => {
        const dateObject = new Date(originalDate);
        const formattedDate = dateObject.toISOString().slice(0, 16);
        return formattedDate;
      });
    res.status(200).json({
        succeded:true,
        data:formattedDates
    })
})
const deleteAppointment = tryCatch(async (req,res)=>{
    const id = req.params.id
    const remove = await Appointment.findByIdAndDelete(id)
    res.status(200).json({
        succeded:true,
    })
})
const Appointments = {
    create,
    bringDoctorActiveAppointments,
    bringPatientActiveAppointments,
    doctorAppointmentHours,
    deleteAppointment
}
export default Appointments