import axios from "axios";
import { toast } from "react-toastify";

const api_call = import.meta.env.VITE_API_URL;

const createDevice = async (formData) => {
  try {
    await axios.post(`${api_call}/createDevice`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Device created successfully!");
  } catch (error) {
    toast.error("Device not created ");
    console.log(error, "Create Device error");
  }
};

const getAllDevice = async (page = 1, limit = 5, search) => {
  try {
    const response = await axios.get(`${api_call}/findAllDevice`, {
      params: { page, limit, search },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error, "Get Device error");
    return { totalCount: 0, items: [] };
  }
};

const getOneDevice = async (id) => {
  try {
    const response = await axios.get(`${api_call}/findOneDevice/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error, "GetOne Device error");
  }
};

const updateDevice = async (formData, id) => {
  try {
    await axios.put(`${api_call}/updateDevice/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Device updated successfully!");
  } catch (error) {
    toast.error("Device not updated!");
    console.log(error, "Create Device error");
  }
};

const deleteDevice = async (_id) => {
  try {
    await axios.put(
      `${api_call}/deleteDevice/${_id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Device deleted successfully!");
  } catch (error) {
    toast.error("Device not deleted!");
    console.log(error.message);
  }
};

export { createDevice, getAllDevice, getOneDevice, updateDevice, deleteDevice };
