import mongoose from "mongoose";
import bcrypt from "bcrypt"
const {
    Schema
} = mongoose;
const userSchema = new Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    isStatus: {
        type: Boolean,
        default: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
    },
    userRole: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user_role",
    },
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country",
    },
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
    },
    districtId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "District",
    },
    neighbourhoodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "neighbourhood",
    },
    type:{
        type:String,
        enum:["doctor","user"]
    },
    tokens:[{type: Object}]

}, {
    timestamps: true
})
userSchema.pre("save", function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        user.password = hash;
        next();
    })
})

const User = mongoose.model("User", userSchema)

export default User