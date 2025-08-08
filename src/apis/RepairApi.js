import axios from "axios";
import { toast } from "react-toastify";

const api_call = import.meta.env.VITE_API_URL;

const getAllRepair = async (page = 1, limit = 5, search) => {
  try {
    const response = await axios.get(`${api_call}/getAllRepair`, {
      params: { page, limit, search },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error, "data not found");
    return { totalCount: 0, items: [] };
  }
};

const getOneRepair = async (id) => {
  try {
    const response = await axios.get(`${api_call}/getRepair/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error, "data not found");
  }
};

const createRepair = async (formData) => {
  try {
    const response = await axios.post(`${api_call}/createRepair`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Repair added successfully!");
  } catch (error) {
    toast.error("Repair not created!");
    console.log(error, "Repair not create ");
  }
};

const updateRepair = async (formData, id) => {
  try {
    const response = await axios.put(
      `${api_call}/updateRepair/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Repair updated successfully!");
    return response;
  } catch (error) {
    toast.error(error, "Repair not update");
    console.log(error, "Repair not update");
  }
};

const deleteRepair = async (id) => {
  try {
    await axios.put(
      `${api_call}/deleteRepair/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Repair deleted successfully!");
  } catch (error) {
    toast.error("Repair not deleted!");
    console.log(error, "Repair not delete");
  }
};

export { getAllRepair, getOneRepair, createRepair, updateRepair, deleteRepair };
