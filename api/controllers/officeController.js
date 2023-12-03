import Office from "../models/officeModel.js";
import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appError.js"
import User from "../models/user/userModel.js";
const officeDetail = tryCatch (async (req,res)=>{
    const id = req.params.id
    const data = await Office.findOne({_id:id})
    .populate({ path: 'countryId', select: 'name' })
    .populate({ path: 'cityId', select: 'name' })
    .populate({ path: 'districtId', select: 'name' })
    .populate({ path: 'neighbourhoodId', select: 'name' })
    const user = await User.findOne({_id:data?.ownerId})
    let detail = {}
    detail.firstName = user?.firstName || ""
    detail.lastName = user?.lastName || ""
    detail.email = user?.email || ""
   // detail.password = user?.password || ""
    detail.phoneNumber = user?.phoneNumber || ""
    detail.address = user?.address || ""
    detail.image_url = user?.image_url || ""
    detail.phoneNumber = user?.phoneNumber || ""

    detail.companyName = data?.companyName || ""
    detail.companyTitle = data?.companyTitle || ""
    detail.taxNo = data?.taxNo || ""
    detail.taxOffice = data?.taxOffice || ""
    detail.logo_url = data?.logo_url || ""
    detail.coverPhoto = data?.coverPhoto || ""
    detail.description = data?.description || ""
    detail.aboutUs = data?.aboutUs || ""
    detail.address = data?.address || ""
    detail.longitude = data?.longitude || ""
    detail.latitude = data?.latitude || ""
    detail.country = data?.countryId.name || ""
    detail.city = data?.cityId.name || ""
    detail.district = data?.districtId.name || ""
    detail.neighbourhood = data?.neighbourhoodId.name || ""

    res.status(200).json({
        succeded:true,
        data:detail
    })
})

const office ={
    officeDetail
}
export default office