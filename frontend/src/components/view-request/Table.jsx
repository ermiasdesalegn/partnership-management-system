/* eslint-disable react/prop-types */
import { useState } from "react";

const Table = ({ headers, rows }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAccept = () => {
    alert("Request Accepted");
    closeModal();
  };

  const handleDecline = () => {
    setIsDeclineModalOpen(true);
  };

  const handleSendRejection = () => {
    alert(`Request Declined. Reason: ${rejectionReason}`);
    setRejectionReason("");
    setIsDeclineModalOpen(false);
    closeModal();
  };

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-800 uppercase bg-gray-400 ">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-3 ">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="bg-gray-100 border-b dark:border-gray-700 hover:bg-gray-200  cursor-pointer"
              onClick={() => handleRowClick(row)}
            >
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4">
                  {cell}
                </td>
              ))}
              <td className="px-6 py-4 space-x-2 sm:space-y-1">
                <button
                  className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Accepted");
                  }}
                >
                  Proceed
                </button>
                <button
                  className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                  onClick={handleDecline}
                >
                  Decline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav
        className="flex justify-center items-center p-4"
        aria-label="Table navigation"
      >
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-700 bg-white border border-gray-300 rounded-s-lg  hover:bg-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              Previous
            </a>
          </li>
          {[1, 2, 3, 4, 5].map((page) => (
            <li key={page}>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-700 bg-white border border-gray-300 hover:bg-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                {page}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-700 bg-white border border-gray-300 rounded-e-lg hover:text-gray-700 hover:bg-gray-400 dark:hover:text-white"
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
      {/* Request Details Modal */}
      {isModalOpen && (
        <div
          id="large-modal"
          tabIndex="-1"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50"
        >
          <div className="relative w-full max-w-4xl max-h-full">
            <div className="relative bg-gray-100 rounded-lg shadow-sm">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-xl font-medium text-gray-900">
                  Request Details
                </h3>
                <button
                  type="button"
                  className="text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={closeModal}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal Body */}
              <div className="p-4 md:p-5 space-y-4">
                {selectedRow && (
                  <>
                    <p className="text-base leading-relaxed text-gray-700">
                      <strong>ID:</strong> {selectedRow[0]}
                    </p>
                    <p className="text-base leading-relaxed text-gray-700">
                      <strong>Name:</strong> {selectedRow[1]}
                    </p>
                    <p className="text-base leading-relaxed text-gray-700">
                      <strong>Email:</strong> {selectedRow[2]}
                    </p>
                    <p className="text-base leading-relaxed text-gray-700">
                      <strong>Company Name:</strong> {selectedRow[3]}
                    </p>
                    <p className="text-base leading-relaxed text-gray-700">
                      <strong>Company Type:</strong> {selectedRow[4]}
                    </p>
                    <p className="text-base leading-relaxed text-gray-700">
                      <strong>Partnership Type:</strong> {selectedRow[5]}
                    </p>
                  </>
                )}
              </div>
              {/* Modal Footer */}
              <div className="flex items-center p-4 md:p-5 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="button"
                  className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  onClick={handleAccept}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  onClick={handleDecline}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decline Reason Modal */}
      {isDeclineModalOpen && (
        <div
          id="decline-modal"
          tabIndex="-1"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50"
        >
          <div className="relative w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                <h3 className="text-xl font-medium text-gray-900">
                  Reason for Rejection
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setIsDeclineModalOpen(false)}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal Body */}
              <div className="p-4 md:p-5 space-y-4">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg "
                  rows="4"
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
              {/* Modal Footer */}
              <div className="flex items-center p-4 md:p-5 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={handleSendRejection}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
