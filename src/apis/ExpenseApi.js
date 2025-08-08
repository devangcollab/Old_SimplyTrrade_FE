import axios from "axios";
import { toast } from "react-toastify";

const api_call = import.meta.env.VITE_API_URL;

const getAllExpense = async (page = 1, limit = 5, search) => {
  try {
    const response = await axios.get(`${api_call}/allExpense`, {
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

const getOneExpense = async (id) => {
  try {
    const response = await axios.get(`${api_call}/expense/${id}`, {
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

const createExpense = async (formData) => {
  try {
    const response = await axios.post(`${api_call}/createExpense`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Expense added successfully!");
  } catch (error) {
    toast.error("Expense not create ");
    console.log(error, "Expense not create ");
  }
};

const updateExpense = async (formData, id) => {
  try {
    const response = await axios.put(
      `${api_call}/updateExpense/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Expense updated successfully!");
    return response;
  } catch (error) {
    toast.error("Expense not update!");
    console.log(error, "expense not update");
  }
};

const deleteExpense = async (id) => {
  try {
    await axios.put(
      `${api_call}/deleteExpense/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Expense deleted successfully!");
  } catch (error) {
    toast.error("Expense not delete!");
    console.log(error, "expense not delete");
  }
};

export {
  getAllExpense,
  getOneExpense,
  createExpense,
  updateExpense,
  deleteExpense,
};
