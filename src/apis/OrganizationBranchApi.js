import axios from "axios";
import { toast } from "react-toastify";

const api_call = import.meta.env.VITE_API_URL;

const createOrgBranch = async (formData) => {
  try {
    const response = await axios.post(
      `${api_call}/createOrganizationBranch`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Organization Branch created successfully!");
    return response;
  } catch (error) {
    toast.error("Organization Branch not created ");
    console.log(error, "createOrg error");
  }
};

const getAllUserOrgBranch = async (page = 1, limit = 5, search) => {
  try {
    const response = await axios.get(
      `${api_call}/findAllUserOrganizationBranch`,
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
    console.log(error, "createOrg error");
    return { totalCount: 0, items: [] };
  }
};
const updateOrgBranch = async (formData, id) => {
  try {
    const response = await axios.put(
      `${api_call}/updateOrganizationBranch/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Organization Branch updated successfully!");
    return response;
  } catch (error) {
    toast.error("Organization Branch not updated!");
    console.log(error, "createOrg error");
  }
};

const deleteOrgBranch = async (_id) => {
  try {
    await axios.put(
      `${api_call}/deleteOrganizationBranch/${_id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Organization Branch deleted successfully!");
  } catch (error) {
    toast.error("Organization Branch not deleted!");
    console.log(error.message);
  }
};

const getOrgBranch = async (id) => {
  try {
    const response = await axios.get(
      `${api_call}/selectOrganizationBranch/${id}`,
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
  createOrgBranch,
  getAllUserOrgBranch,
  updateOrgBranch,
  deleteOrgBranch,
  getOrgBranch,
};
