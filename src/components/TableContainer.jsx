import { useMemo, useState } from "react";
import "./style.css";


const formatINR = (amount) => {
  return `₹ ${Number(amount).toLocaleString()}`;
};


const TableContainer = ({ data, head, width = 900 }) => {
  const [page, setPage] = useState(1);
  const [row, setRows] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");


  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        item["percentage.funded"]?.toString().toLowerCase().includes(lowerQuery) ||
        item["amt.pledged"]?.toString().toLowerCase().includes(lowerQuery)
      );
    });
  }, [data, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / row);
  const pageData = useMemo(
    () => filteredData.slice((page - 1) * row, page * row),
    [filteredData, page, row]
  );

  const handleItemsPerPageChange = (e) => {
    setRows(Number(e.target.value));
    setPage(1);
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (start > 1) {
      pageNumbers.push(1);
      if (start > 2) pageNumbers.push("...");
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (!filteredData.length) {
    return <p>No data available</p>;
  }

  return (
    <div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Percentage Funded or Amt. Pledged"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-box"
        />
      </div>

      <table style={{ width }}>
        <caption>Table displaying data with pagination and rows per page selection</caption>
        <thead>
          <tr>
            {head?.map((name, indx) => (
              <th key={indx} scope="col">
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData?.map((user, index) => (
            <tr key={`${user["s.no"]}-${index}`}>
              <td>{user["s.no"]}</td>
              <td>{user["percentage.funded"]}%</td>
              <td>{formatINR(user["amt.pledged"])}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={3}>
              <div className="pagination-controls">
 
                <button
                  onClick={goToPreviousPage}
                  disabled={page === 1}
                  aria-label="Go to previous page"
                >
                  &#x2190;
                </button>

                <div className="page-numbers">
                  {getPageNumbers().map((item, index) =>
                    item === "..." ? (
                      <span key={index} className="ellipsis">
                        ...
                      </span>
                    ) : (
                      <button
                        key={index}
                        onClick={() => setPage(item)}
                        className={page === item ? "active" : ""}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={page === totalPages}
                  aria-label="Go to next page"
                >
                  &#x2192;
                </button>


                <select value={row} onChange={handleItemsPerPageChange}>
                  <option value={1}>1</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableContainer;
