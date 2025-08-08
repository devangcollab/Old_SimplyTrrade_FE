import { useEffect, useState } from "react";
import { getAllCategory } from "../apis/CategoryApi";
import CategoryTable from "../tables/CategoryTable";

const Category = () => {
  const [category, setCategory] = useState([]);

  const callApi = async () => {
    const response = await getAllCategory();
    setCategory(response.data.data);
  };

  useEffect(() => {
    callApi();
  }, []);

  return <CategoryTable />;
};

export default Category;
