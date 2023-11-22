import axios from "./axiosInstance";
import axiosJSON from "./axiosJson";
import Swal from "sweetalert2";
import { logoutFromSystem } from "../utils/auth";

const getFilteredContent = async (data, location, query) => {
  let Query = "";
  if (query && Object.keys(query).length) {
   Object.entries(query)
      .map(([k, v]) => {
        console.log('AdvertFİlter', k, v)
        if(Query){
          Query += `&${k}=${v}`
        }else {
          Query += `?${k}=${v}`
        }
      })
  }

  try {
    const response = await axios({
      method: "POST",
      url: `/advert/advertfilter${Query}`,
      data: { ...data, ...location },
    });

    return response;
  } catch (error) {
    if (error?.response?.status == 401) {
      logoutFromSystem();
    } else {
      console.error(error);
      throw error;
    }
  }
};


const getOneAdvertWithNo = async (no, password = '', vipNo = '') => {
  let urlStr = `/advert/${no}`;
  if (vipNo) urlStr += `?vip=${vipNo}`
  const config = {
    method: "POST",
    url: urlStr,
  }
  if (password) config.data = { password }
  const mall = await axiosJSON(config)
    .then((response) => response)
    .catch((error) => {
      if (error?.response?.status == 401) {
        logoutFromSystem()
      } else {
        return error;
      }
    });
  return mall;
};

const filterService = {
  getFilteredContent,
  getOneAdvertWithNo,
};

export default filterService;
