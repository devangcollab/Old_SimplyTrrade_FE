import axios from "axios";
import { toast } from "react-toastify";

const api_call = import.meta.env.VITE_API_URL;

const createStock = async (formData) => {
  try {
    await axios.post(`${api_call}/createStock`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Stock created successfully!");
  } catch (error) {
    toast.error("Stock not created ");
    console.log(error, "Create Stock error");
  }
};

const updateStock = async (formData, id) => {
  try {
    await axios.put(`${api_call}/updateStock/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Stock updated successfully!");
  } catch (error) {
    toast.error("Stock not updated!");
    console.log(error, "Update Stock error");
  }
};

const getOneStock = async (id) => {
  try {
    const response = await axios.get(`${api_call}/stock/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("get Stock error:", error);
    return null; // Prevents calling code from breaking
  }
};

const getAllStocks = async (page = 1, limit = 5, search) => {
  try {
    const response = await axios.get(`${api_call}/allStock`, {
      params: { page, limit, search },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error, "get All Stock error");
    return { totalCount: 0, items: [] };
  }
};
const deleteStock = async (id) => {
  try {
    await axios.put(
      `${api_call}/deleteStock/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Stock deleted successfully!");
  } catch (error) {
    toast.error("Stock not deleted!");
    console.log(error, "get All Stock error");
  }
};

export { createStock, updateStock, getOneStock, getAllStocks, deleteStock };
