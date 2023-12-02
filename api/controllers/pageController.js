import tryCatch from "../utils/tryCatch.js";
import Country from "../models/location/countryModel.js"
import User from "../models/user/userModel.js"
import UserRole from "../models/user/userRoleModel.js"
import City from "../models/location/cityModel.js"
const getDoctorFilterKey = tryCatch(async (req, res) => {
 
  const country = await Country.find({}, "-createdAt -updatedAt");
  const city = await City.find({}, "-createdAt -updatedAt");
  const userRole = await UserRole.find({})
  let countryData = [];
  let cityData = [];
  let roleData = [];

  if (city) {
    for (const i of city) {
      cityData.push({
        label: i.name,
        value: i._id,
      });
    }
  }
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
    // country: {
    //   type: "combobox",
    //   label: "Ülke",
    //   value: "country",
    //   options: countryData,
    // },
    city: {
      type: "string",
      label: "İl",
      value: "city",
      options:cityData
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
const getBlogFilterKey = tryCatch(async (req, res) => {
 
  const user = await User.find({isApproved:true,type:"doctor"})
  let userData = [];

 
  if (user) {
    for (const i of user) {
      userData.push({
        label: i.firstName +" "+i.lastName,
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
    user: {
      type: "combobox",
      label: "Doktor Seç",
      value: "user",
      options: userData,
    }

  };

    

  res.status(200).json({
    succeded: true,
    data: obj,
  });
});

export {
  getDoctorFilterKey,
  getBlogFilterKey
};
