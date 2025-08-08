import axios from "axios";
import { toast } from "react-toastify";

const api_call = import.meta.env.VITE_API_URL;

const createModel = async (formData) => {
  try {
    const response = await axios.post(`${api_call}/createModel`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Model created successfully!");
  } catch (error) {
    toast.error("Model not created ");
    console.log(error, "createOrg error");
  }
};

const updateModel = async (formData, id) => {
  try {
    const response = await axios.put(
      `${api_call}/updateModel/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Model updated successfully!");
    return response;
  } catch (error) {
    toast.error("Model not updated!");
    console.log(error, "createOrg error");
  }
};

const findOneModel = async (id) => {
  try {
    const response = await axios.get(`${api_call}/findOneModel/${id}`, {
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

const deleteModel = async (_id) => {
  try {
    await axios.put(
      `${api_call}/deleteModel/${_id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Model deleted successfully!");
  } catch (error) {
    toast.error("Model not deleted!");
    console.log(error.message);
  }
};

const getBranchModel = async (branchId) => {
  try {
    const response = await axios.get(
      `${api_call}/selectDeviceByModel/${branchId}`,
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

export { createModel, updateModel, findOneModel, deleteModel, getBranchModel };
