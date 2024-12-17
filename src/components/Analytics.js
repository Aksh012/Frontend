import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDarkMode } from "../context/DarkModeContext"; // Importing the custom hook
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Access dark mode state and toggle function
  const { darkMode, toggleDarkMode } = useDarkMode();

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://saasbackend-380j.onrender.com/api/users"
      );
      setUsers(response.data); // Set user data
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Define columns for react-table
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name", // Access user.name
      },
      {
        Header: "Email",
        accessor: "email", // Access user.email
      },
      {
        Header: "Registration Date",
        accessor: "dateOfRegistration",
        Cell: ({ value }) => new Date(value).toLocaleDateString(), // Format date
      },
    ],
    []
  );

  // Persist page size in localStorage
  const getStoredPageSize = () =>
    Number(localStorage.getItem("pageSize")) || 10;

  // Set up table instance with react-table hooks
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
    state: { globalFilter, pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: users,
      initialState: { pageIndex: 0, pageSize: getStoredPageSize() }, // Start on first page
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Persist page size in localStorage
  useEffect(() => {
    localStorage.setItem("pageSize", pageSize);
  }, [pageSize]);

  // Function to export table data as CSV
  const exportToCSV = () => {
    const header = columns.map((col) => col.Header).join(",") + "\n"; // Get column headers
    const rowsData = users.map((user) =>
      columns
        .map((column) => user[column.accessor] || "") // Extract data for each column
        .join(",")
    );
    const csvContent = header + rowsData.join("\n");

    // Create a Blob from the CSV content and download it
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "users_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark:bg-gray-900 dark:text-white" : "bg-gray-50 text-black"
      } container-fluid mx-auto px-4 py-6`}
      style={{
        marginLeft: "3.5rem",
        minHeight: "100vh", // Ensure the page extends fully
      }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">User List</h2>
        {/* Export Button */}
        <button
          onClick={exportToCSV}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Export to CSV
        </button>
      </div>

      {/* Global Filter (Search) */}
      <input
        type="text"
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search by name or email"
        className="mb-4 p-2 border rounded w-full shadow-sm dark:bg-gray-700 dark:text-white"
      />

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto h-full">
          <table
            {...getTableProps()}
            className="min-w-full sm:h-full h-[80vh] bg-white dark:bg-gray-800 border border-gray-200 rounded-md shadow-md"
          >
            <thead className="bg-gray-100 dark:bg-gray-700">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="sm:px-4 px-0 sm:py-2 py-0 text-left font-medium text-gray-600 dark:text-gray-300"
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="overflow-y-auto h-full">
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className="border-t border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {row.cells.map((cell, index) => (
                      <td
                        {...cell.getCellProps()}
                        className="sm:px-4 px-1 py-2 text-gray-700 dark:text-gray-300"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 flex-wrap">
        <div className="flex items-center">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="mt-4 sm:mt-0">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </div>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="p-2 sm:mb-0 cursor-pointer mb-20 border rounded dark:bg-gray-700 dark:text-white mt-4 sm:mt-0"
        >
          {[5, 10, 20].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default UserTable;
