// import React, { useState } from "react";
// import {
//   FaSearch,
//   FaTrash,
//   FaChevronLeft,
//   FaChevronRight,
//   FaTimes,
//   FaUser,
//   FaFilePdf,
//   FaComment,
//   FaPaperPlane,
//   FaCheckCircle,
// } from "react-icons/fa";
// import { GlobalWorkerOptions } from "pdfjs-dist";

import { useState } from "react";
import { FaCheckCircle, FaPaperPlane, FaSearch, FaTrash } from "react-icons/fa";

// // Dynamically import the worker for PDF.js
// if (typeof window !== 'undefined') {
//   import('pdfjs-dist/build/pdf.worker.mjs').then(pdfjsWorker => {
//     GlobalWorkerOptions.workerSrc = pdfjsWorker.default;
//   });
// }

export const TechnicalRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      user: "Arega Mulugeta",
      email: "arega.mulugeta@example.com",
      pdf: "/Arega-Mulugeta.pdf", // PDF file in the public folder
      date: "2023-10-01",
      details: "Request for document review",
      status: "pending",
      comments: [],
    },
    {
      id: 2,
      user: "Jane Smith",
      email: "jane.smith@example.com",
      pdf: "/sample2.pdf",
      date: "2023-10-05",
      details: "Contract review request",
      status: "resolved",
      comments: [
        {
          id: 1,
          author: "Admin",
          message: "Approved with minor changes",
          timestamp: "2023-10-05 14:30",
        },
      ],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage = 8;

  const filteredRequests = requests.filter(
    (item) =>
      item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleDeleteRequest = (id) =>
    setRequests((prev) => prev.filter((item) => item.id !== id));

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: "Admin",
      message: newComment,
      timestamp: new Date().toLocaleString(),
    };

    setRequests((prev) =>
      prev.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request,
              status: "resolved",
              comments: [...request.comments, comment],
            }
          : request
      )
    );

    setNewComment("");
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const StatusBadge = ({ status }) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === "resolved"
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status}
    </span>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Document Requests
      </h1>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-500" />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                User
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Document
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentRequests.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedRequest(item)}
              >
                <td className="px-4 py-4 text-sm text-gray-800">{item.user}</td>
                <td className="px-4 py-4 text-sm text-gray-800">
                  {item.email}
                </td>
                <td className="px-4 py-4 text-sm text-indigo-600 flex items-center">
                  <FaFilePdf className="mr-2" /> Document.pdf
                </td>
                <td className="px-4 py-4 text-sm text-gray-800">{item.date}</td>
                <td className="px-4 py-4 text-sm">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-4 text-sm text-gray-800">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRequest(item.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of{" "}
          {Math.ceil(filteredRequests.length / itemsPerPage)}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(filteredRequests.length / itemsPerPage)
          }
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold flex items-center">
                <FaFilePdf className="text-red-500 mr-2" />
                Document Review
              </h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                {/* Render the PDF Document here */}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4 flex items-center">
                  <FaComment className="text-gray-500 mr-2" /> Discussion
                </h3>

                <div className="space-y-4 mb-6">
                  {selectedRequest.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUser className="text-blue-600" />
                        </div>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            {comment.author}
                          </span>
                          <span className="text-xs text-gray-500">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800">
                          {comment.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="3"
                  />
                  <button
                    onClick={handleCommentSubmit}
                    className="px-6 h-12 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center"
                  >
                    <FaPaperPlane className="mr-2" /> Send
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end space-x-4">
              <button
                onClick={() => {
                  handleDeleteRequest(selectedRequest.id);
                  setSelectedRequest(null);
                }}
                className="px-4 py-2 text-red-600 hover:text-red-700 flex items-center"
              >
                <FaTrash className="mr-2" /> Delete Request
              </button>
              {selectedRequest.status === "pending" && (
                <button
                  onClick={handleCommentSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <FaCheckCircle className="mr-2" /> Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// export default Requests;
