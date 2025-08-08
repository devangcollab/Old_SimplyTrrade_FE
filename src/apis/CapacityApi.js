import axios from "axios";
import { toast } from "react-toastify";

const api_call = import.meta.env.VITE_API_URL;

const createCapacity = async (formData) => {
  try {
    await axios.post(`${api_call}/createCapacity`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Capacity created successfully!");
  } catch (error) {
    toast.error("Capacity not created ");
    console.log(error, "Create Capacity error");
  }
};

const getAllCapacity = async (page = 1, limit = 5, search) => {
  try {
    const response = await axios.get(`${api_call}/allCapacity`, {
      params: { page, limit, search },
      headers: {
        "Content-Type ": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error, "get Capacity error");
    return { totalCount: 0, items: [] };
  }
};

const updateCapacity = async (formData, id) => {
  try {
    const response = await axios.put(
      `${api_call}/updateCapacity/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Capacity updated successfully!");
  } catch (error) {
    toast.error("Capacity not updated!");
    console.log(error.message);
  }
};

const deleteCapacity = async (id) => {
  try {
    const response = await axios.put(
      `${api_call}/deleteCapacity/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Capacity deleted successfully!");
    return response;
  } catch (error) {
    toast.error("Capacity not deleted!");
    console.log(error.message);
  }
};

const getOneCapacity = async (id) => {
  try {
    const response = await axios.get(`${api_call}/capacity/${id}`, {
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

export {
  createCapacity,
  getAllCapacity,
  updateCapacity,
  deleteCapacity,
  getOneCapacity,
};
