import axios from "axios";

const api_call = import.meta.env.VITE_API_URL;

const getProfitLoss = async (page = 1, limit = 5, search) => {
  try {
    const response = await axios.get(`${api_call}/profitLoss`, {
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

export { getProfitLoss };
