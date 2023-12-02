import tryCatch from "../utils/tryCatch.js";
import Country from "../models/location/countryModel.js"
import UserRole from "../models/user/userRoleModel.js"


const getDoctorFilterKey = tryCatch(async (req, res) => {
 
  const country = await Country.find({}, "-createdAt -updatedAt");
  const userRole = await UserRole.find({})
  let countryData = [];
  let roleData = [];

  if (country) {
    for (const i of country) {
      countryData.push({
        label: i.name,
        value: i._id,
      });
    }
  }
  if (userRole) {
    for (const i of userRole) {
      roleData.push({
        label: i.role,
        value: i._id,
      });
    }
  }
  let obj = {
    searchKey: {
      type: "string",
      label: "Arama",
      value: "searchKey",
    },
    role: {
      type: "combobox",
      label: "Kategori",
      value: "role",
      options: roleData,
    },
    country: {
      type: "combobox",
      label: "Ülke",
      value: "country",
      options: countryData,
    },
    city: {
      type: "string",
      label: "İl",
      value: "city",
    },
    district: {
      type: "string",
      label: "İlçe",
      value: "district",
    },
    neighbourhood: {
      type: "string",
      label: "Mahalle",
      value: "neighbourhood",
    },

  };

    

  res.status(200).json({
    succeded: true,
    data: obj,
  });
});


export {
  getDoctorFilterKey
};
