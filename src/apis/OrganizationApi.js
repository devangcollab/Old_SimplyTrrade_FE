import axios from "axios";
import { toast } from "react-toastify";

const api_call = import.meta.env.VITE_API_URL;

const createOrg = async (formData) => {
  try {
    const response = await axios.post(`${api_call}/createOrg`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Organization created successfully!");
  } catch (error) {
    toast.error("Organization not created ");
    console.log(error, "createOrg error");
  }
};

const updateOrg = async (formData, id) => {
  try {
    const response = await axios.put(`${api_call}/updateOrg/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Organization updated successfully!");
  } catch (error) {
    toast.error("Organization not updated!");
    console.log(error, "createOrg error");
  }
};

const allUserOrg = async (page = 1, limit = 5, search) => {
  try {
    const response = await axios.get(`${api_call}/allUserOrg`, {
      params: { page, limit, search }, // Pass page and limit as query parameters
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token for auth
      },
    });

    return response.data; // Return both the totalCount and items
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return { totalCount: 0, items: [] }; // Return empty data on error
  }
};

const deleteOrg = async (_id) => {
  try {
    await axios.put(
      `${api_call}/deleteOrg/${_id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Organization deleted successfully!");
  } catch (error) {
    toast.error("Organization not deleted!");
    console.log(error.message);
  }
};

export { createOrg, updateOrg, allUserOrg, deleteOrg };
