import mongoose from "mongoose";

const { Schema } = mongoose;
const appointmentSchema  = new Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateTime: Date,
    status: {
        type:Boolean,
        default:true
    },
}, {
    timestamps: true
})

const Appointment = mongoose.model("appointment", appointmentSchema )

export default Appointment