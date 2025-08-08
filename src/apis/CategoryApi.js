import axios from "axios";
import { toast } from "react-toastify";

const api_call = import.meta.env.VITE_API_URL

const createCategory = async (formData) => {
  try {
    await axios.post(`${api_call}/createCategory`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Category created successfully!");
  } catch (error) {
    toast.error("Category not created ");
    console.log(error, "Create Category error");
  }
};

const getAllCategory = async (page = 1, limit = 5, search) => {
  try {
    const response = await axios.get(`${api_call}/allCategory`, {
      params: { page, limit, search  },
      headers: {
        "Content-Type ": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error, "get Category error");
    return { totalCount: 0, items: [] };
  }
};

const getOneCategory = async (id) => {
  try {
    const response = await axios.get(
      `${api_call}/category/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error.message);
  }
};

const deleteCategory = async (id) => {
  try {
    const response = await axios.put(
      `${api_call}/deleteCategory/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Category deleted successfully!");
    return response;
  } catch (error) {
    toast.error("Category not deleted!");
    console.log(error.message);
  }
};
const updateCategory = async (formData, id) => {
  try {
    const response = await axios.put(
      `${api_call}/updateCategory/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Category updated successfully!");
    return response;
  } catch (error) {
    toast.error("Category not updated!");
    console.log(error.message);
  }
};

const getBranchCategory = async (branchId) => {
  try {
    const response = await axios.get(
      `${api_call}/selectCategoryByBranch/${branchId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error, "createOrg error");
  }
};

export {
  createCategory,
  getAllCategory,
  getOneCategory,
  deleteCategory,
  updateCategory,
  getBranchCategory,
};
