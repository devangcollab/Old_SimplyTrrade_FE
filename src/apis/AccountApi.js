import axios from "axios";
import { toast } from "react-toastify";

const api_call = import.meta.env.VITE_API_URL;

const createAccount = async (formData) => {
  try {
    const response = await axios.post(`${api_call}/createAccount`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Account created successfully!");
  } catch (error) {
    toast.error("Account not created ");
    console.log(error, "createUser error");
  }
};
const updateAccount = async (formData, id) => {
  try {
    const response = await axios.put(
      `${api_call}/updateAccount/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Account updated successfully!");
    return response;
  } catch (error) {
    toast.error("Account not updated!");
    console.log(error, "updateUser error");
  }
};
const getAllAccounts = async (search) => {
  try {
    const response = await axios.get(
      `${api_call}/allAccount`,

      {
        params: { search },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error, "updateUser error");
  }
};

const getOneAccount = async (id) => {
  try {
    const response = await axios.get(`${api_call}/account/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error.message);
  }
};

const deleteAccount = async (id) => {
  try {
    const response = await axios.put(
      `${api_call}/deleteAccount/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Account deleted successfully!");
    return response;
  } catch (error) {
    toast.error("Account not deleted!");
    console.log(error.message);
  }
};

export {
  createAccount,
  updateAccount,
  getAllAccounts,
  getOneAccount,
  deleteAccount,
};
