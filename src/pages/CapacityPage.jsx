import { useEffect, useState } from "react";
import { getAllCapacity } from "../apis/CapacityApi";
import CapacityTable from "../tables/CapacityTable";

const CapacityPage = () => {
  const [capacity, setCapacity] = useState([]);

  const callApi = async () => {
    const response = await getAllCapacity();
    setCapacity(response.data.data);
  };

  useEffect(() => {
    callApi();
  }, []);

  return <CapacityTable capacity={capacity} callApi={callApi} />;
};

export default CapacityPage;
