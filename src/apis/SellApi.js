import axios from "axios";
import { toast } from "react-toastify";

const api_call = import.meta.env.VITE_API_URL;

const createSell = async (formData) => {
  try {
    const response = await axios.post(`${api_call}/createSell`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Sell created successfully!");
    return response;
  } catch (error) {
    toast.error("Sell not created ");
    console.log(error, "createSell error");
  }
};
const getOneSell = async (id) => {
  try {
    const response = await axios.get(`${api_call}/sell/${id}`, {
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

const updateSell = async (formData, id) => {
  try {
    const response = await axios.put(`${api_call}/updateSell/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Sell updated successfully!");
    return response;
  } catch (error) {
    toast.error("Sell not updated!");
    console.log(error, "updateSell error");
  }
};

const allSell = async (page = 1, limit = 5, search) => {
  try {
    const response = await axios.get(`${api_call}/allSell`, {
      params: { page, limit, search }, // Pass page and limit as query parameters
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token for auth
      },
    });

    return response.data; // Return both the totalCount and items
  } catch (error) {
    console.error("Error fetching allSell:", error);
    return { totalCount: 0, items: [] }; // Return empty data on error
  }
};
const allSellStockRepair = async (
  page = 1,
  limit = 5,
  type,
  orgId,
  cusId,
  startDate,
  endDate
) => {
  try {
    const response = await axios.get(`${api_call}/allSellStockRepair`, {
      params: { page, limit, type, orgId, cusId, startDate, endDate },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data; // Return both the totalCount and items
  } catch (error) {
    console.error("Error fetching allSellStockRepair:", error);
    return { totalCount: 0, items: [] }; // Return empty data on error
  }
};

const deleteSell = async (_id) => {
  try {
    await axios.put(
      `${api_call}/deleteSell/${_id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("Sell deleted successfully!");
  } catch (error) {
    toast.error("Sell not deleted!");
    console.log(error.message);
  }
};

export {
  createSell,
  getOneSell,
  updateSell,
  allSell,
  allSellStockRepair,
  deleteSell,
};
