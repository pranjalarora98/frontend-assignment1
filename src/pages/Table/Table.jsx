import { useEffect, useState } from "react";
import TableContainer from "../../components/TableContainer";
import { fetchJson } from "../../data/fetchJson";


const URL =
  "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json";

const Table = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchJson(URL);
      setData(res);
    };
    fetchData();
  }, []);

  return (
      <TableContainer
        data={data}
        head={["S.No.", "Percentage funded", "Amount Pleadged"]}
        width={800}
      />
  );
};
export default Table;