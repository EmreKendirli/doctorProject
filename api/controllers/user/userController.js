import tryCatch from "../../utils/tryCatch.js"
import AppError from "../../utils/appError.js"
import User from "../../models/user/userModel.js";
import jwt from "jsonwebtoken"

import bcrypt from "bcrypt"
import Office from "../../models/officeModel.js";
const doctorRegister = tryCatch(async (req, res) => {
    const register = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
        type: "doctor",
        userRole: req.body.userRole
    });
    if (!register) {
        return res.status(404).json({
            succeded: false,
            // message: i18n.translate("USERS.USER_NOT_CREATED", lang),
        });
    }
    const office = await Office.create({
        ownerId: register._id,
        companyName: req.body.companyName,
        companyTitle: req.body.companyTitle,
        taxNo: req.body.taxNo,
        taxOffice: req.body.taxOffice,
        countryId: req.body.countryId,
        cityId: req.body.cityId,
        districtId: req.body.districtId,
        neighbourhoodId: req.body.neighbourhoodId,
    })
    res.status(200).json({
        succeded: true,
        //message: i18n.translate("USERS.USER_CREATED", lang)
    });
});
const individualRegister = tryCatch(async (req, res) => {
    const register = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
        type: "user",
        isApproved: true,
    });
    if (!register) {
        return res.status(404).json({
            succeded: false,
            //message: i18n.translate("USERS.USER_NOT_CREATED", lang),
        });
    }
    res.status(200).json({
        succeded: true,
        //message: i18n.translate("USERS.USER_CREATED", lang)
    });
});
const userLogin = tryCatch(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
        email,
    });

    let same = false;
    if (user) {
        same = await bcrypt.compare(password, user.password);
    } else {
        throw new AppError("User Bulunamadı", 404);
    }
    if (same) {
        const user = await User.findOne(
            {
                email,
            },
            "-password -token"
        );
        const token = await createToken(user._id);

        if (!token) {
            //throw new AppError(i18n.translate("USERS.USER_TOKEN_ERROR", lang), 404);
        }
        let oldTokens = user.tokens || [];
        if (oldTokens.length) {
            oldTokens.filter((t) => {
                const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
                if (timeDiff < 86400) {
                    return t;
                }
            });
        }
        await User.findByIdAndUpdate(user._id, {
            tokens: [
                ...oldTokens,
                {
                    token,
                    signedAt: Date.now().toString(),
                },
            ],
        });
        const users = await User.findOne(
            {
                email,
            },
            "-password -token -tokens"
        );
        return res.status(200).json({
            succeded: true,
            data: {
                token,
                user: users,
                // message: i18n.translate("USERS.USER_SUCCESS_LOGIN", lang),
            },
        });
    } else {
        throw new AppError("Şifre Hatalı", 401);
    }
});
const createToken = async (id) => {
    return jwt.sign(
        {
            id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );
};
const userFilter = tryCatch(async (req, res) => {
    let { page, paginate } = req.query
    let { role, country, city, district, neighbourhood, searchKey } = req.body
    if (!page) page = 1
    if (!paginate) paginate = 10
    const skip = (page - 1) * paginate

    if (!searchKey) searchKey = ''
    
    let filterObj = {
        "$or": [{
            "companyName": {
                $regex: searchKey
            }
        },
        {
            "companyTitle": {
                $regex: searchKey
            }
        },
        // {
        //     "ownerId": {
        //       $elemMatch: {
        //         "firstName": { $regex: searchKey } // 'posts' alanındaki 'author' alanında arama
        //       }
        //     }
        //   }
        ],
    }
    if (role) {
        const result = await User.find({ userRole: role })
        let filterRole = []
        if (result) {
            for (const i of result) {
                filterRole.push(i._id)
            }
        }
        filterObj.ownerId = { $in: filterRole }
    }

    if (country) filterObj.countryId = country
    if (city) filterObj.cityId = city
    if (district) filterObj.districtId = district
    if (neighbourhood) filterObj.neighbourhoodId = neighbourhood

    const result = await Office.find(filterObj).skip(skip).limit(paginate)
    .populate({ path: 'ownerId', select: 'firstName lastName phoneNumber email userRole image_url', populate :{path:"userRole" , select:"role"}})
    .populate({ path: 'countryId', select: 'name' })
    .populate({ path: 'cityId', select: 'name' })
    .populate({ path: 'districtId', select: 'name' })
    .populate({ path: 'neighbourhoodId', select: 'name' })
    const totalRecord = await Office.find(filterObj).count()
    res.status(200).json({
        succeded: true,
        data: result,
        totalRecord
    })
})
const user = {
    doctorRegister,
    individualRegister,
    userLogin,
    userFilter

}
export default user