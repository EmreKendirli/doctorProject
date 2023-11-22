import axios from "./axiosInstance";

import Swal from "sweetalert2";
import { logoutFromSystem } from "../utils/auth";


const getUsers = async (search = '') => {
    const token = localStorage.getItem("userToken");
    console.log('TOKEN', token)
    let res = await axios({
        method: "GET",
        url: `/chat/users-list?searchKey=${search}`,
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res?.data)
        .catch((error) => {
            if(error?.response?.status == 401) {
              logoutFromSystem()
            }else{
              return error;
            }
          });
    return res;
};

const getMessage = async (conversationId, advertId) => {
    const token = localStorage.getItem("userToken");
    const urlLink = conversationId ? `/chat/message/${conversationId}/${advertId}` : `/chat/user-message/${advertId}`
    let res = await axios({
        method: "GET",
        url: urlLink,
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res?.data)
        .catch((error) => {
            if(error?.response?.status == 401) {
              logoutFromSystem()
            }else{
              return error;
            }
          });
    return res;
};
const getUserMessageWithAdvertId = async ( advertId) => {
    let res = await axios({
        method: "GET",
        url: `/chat/user-message/${advertId}`,
        
    })
        .then((res) => res)
        .catch((error) => {
            if (error?.response?.status == 401) {
                logoutFromSystem()
            } else {
                return error;
            }
        });
    return res?.data;
};
const postMessage = async (data,id) => {
    const token = localStorage.getItem("userToken");
    console.log("data : ", data);
    let res = await axios({
        method: "POST",
        url: `/chat/${id}`,
        headers: { Authorization: `Bearer ${token}` },
        data
    })
        .then((res) => res?.data)
        .catch((error) => {
            if(error?.response?.status == 401) {
              logoutFromSystem()
            }else{
              return error;
            }
          });
    return res;
};



const chatMessageServices = {
    getUsers,
    postMessage,
    getMessage,
    getUserMessageWithAdvertId
};

export default chatMessageServices;
