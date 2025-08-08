import axios from "axios";
import { toast } from "react-toastify";

const api_call = import.meta.env.VITE_API_URL;

const createUser = async (formData) => {
  try {
    const response = await axios.post(`${api_call}/userSignUp`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("User created successfully!");
    return response;
  } catch (error) {
    toast.error("User not created ");
    console.log(error, "createUser error");
  }
};
const updateUser = async (formData, id) => {
  try {
    const response = await axios.put(`${api_call}/updateUser/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("User updated successfully!");
    return response;
  } catch (error) {
    toast.error("User not updated!");
    console.log(error, "updateUser error");
  }
};
const getAllUsers = async (page = 1, limit = 5, search) => {
  try {
    const response = await axios.get(
      `${api_call}/findAllUser`,

      {
        params: { page, limit, search },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error, "updateUser error");
    return { totalCount: 0, items: [] };
  }
};

const getOneUser = async (id) => {
  try {
    const response = await axios.get(`${api_call}/findOneUser/${id}`, {
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

const deleteUser = async (id) => {
  try {
    const response = await axios.put(
      `${api_call}/deleteUser/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("User deleted successfully!");
    return response;
  } catch (error) {
    toast.error("User not deleted!");
    console.log(error.message);
  }
};

export { createUser, updateUser, getAllUsers, getOneUser, deleteUser };
