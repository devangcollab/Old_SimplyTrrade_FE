import axios from "axios";
import { toast } from "react-toastify";

const api_call = import.meta.env.VITE_API_URL;

const createColor = async (formData) => {
  try {
    await axios.post(`${api_call}/createColor`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Color created successfully!");
  } catch (error) {
    toast.error("Color not created ");
    console.log(error, "Create Color error");
  }
};

const getOneColor = async (id) => {
  try {
    const response = await axios.get(`${api_call}/findOneColor/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error, "Create Color error");
  }
};
const updateColor = async (formData, id) => {
  try {
    const response = await axios.put(
      `${api_call}/updateColor/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Color updated successfully!");
    return response;
  } catch (error) {
    toast.error("Color not updated!");
    console.log(error, "Create Color error");
  }
};

const getAllColor = async (page = 1, limit = 5, search) => {
  try {
    const response = await axios.get(`${api_call}/findAllColor`, {
      params: { page, limit, search },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error, "Create Color error");
    return { totalCount: 0, items: [] };
  }
};

const deleteColor = async (id) => {
  try {
    await axios.put(
      `${api_call}/deleteColor/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Color deleted successfully!");
  } catch (error) {
    toast.error("Color not deleted!");
    console.log(error, "Create Color error");
  }
};

export { createColor, getOneColor, updateColor, getAllColor, deleteColor };
