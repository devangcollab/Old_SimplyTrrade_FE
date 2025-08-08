import axios from "axios";
import { toast } from "react-toastify";
const api_call = import.meta.env.VITE_API_URL;

const createCustomer = async (formData) => {
  try {
    await axios.post(`${api_call}/createCustomer`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Customer created successfully!");
  } catch (error) {
    toast.error("Customer not created ");
    console.log(error, "Create Customer error");
  }
};
const updateCustomer = async (formData, id) => {
  try {
    await axios.put(`${api_call}/updateCustomer/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Customer updated successfully!");
  } catch (error) {
    toast.error("Customer not updated!");
    console.log(error, "Update Customer error");
  }
};

const getOneCustomer = async (id) => {
  try {
    if (!id) {
      return;
    }
    const response = await axios.get(`${api_call}/customer/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error, "get Customer error");
  }
};

const getAllCustomer = async (page = 1, limit = 5, search) => {
  try {
    const response = await axios.get(`${api_call}/allCustomer`, {
      params: { page, limit, search },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error, "get All Customer error");
    return { totalCount: 0, items: [] };
  }
};
const deleteCustomer = async (id) => {
  try {
    await axios.put(
      `${api_call}/deleteCustomer/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Customer deleted successfully!");
  } catch (error) {
    toast.error("Customer not deleted!");
    console.log(error, "get All Customer error");
  }
};

export {
  createCustomer,
  updateCustomer,
  getOneCustomer,
  getAllCustomer,
  deleteCustomer,
};
