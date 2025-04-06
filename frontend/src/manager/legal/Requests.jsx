/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
// import { toast } from "react-hot-toast";
import { FaSearch, FaTrash } from "react-icons/fa";
import Modal from "./Modal";

const initialRequests = [
  {
    id: "1a2b3c",
    user: "John Doe",
    email: "john.doe@example.com",
    documents: [
      "legal-agreement.pdf",
      "nda.pdf",
      "security-report.pdf",
      "technical-specs.pdf",
    ],
    date: new Date().toISOString(),
    status: "pending",
    comments: [
      {
        id: "c1",
        text: "Need verification on legal documents",
        author: "Admin",
        timestamp: new Date().toISOString(),
      },
    ],
  },
];

const Requests = () => {
  const commentsEndRef = useRef(null);
  const [requests, setRequests] = useState(initialRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeCategory, setActiveCategory] = useState("legal");
  const [newComment, setNewComment] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedRequest?.comments]);

  const filteredRequests = requests.filter((request) =>
    Object.values(request).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleStatusUpdate = (id, status) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
    toast.success(`Document ${status}!`);
    setSelectedRequest(null);
  };

  const openPDFInNewTab = (pdfPath) => {
    window.open(`${process.env.PUBLIC_URL}/pdf/${pdfPath}`, "_blank");
  };

  const StatusBadge = ({ status }) => (
    <motion.span
      className={`px-3 py-1 rounded-full text-sm ${
        status === "approved"
          ? "bg-green-100 text-green-800"
          : status === "rejected"
          ? "bg-red-100 text-red-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
    >
      {status}
    </motion.span>
  );

  const CategoryPill = ({ category }) => (
    <motion.button
      className={`px-4 py-2 rounded-full text-sm font-medium ${
        activeCategory === category
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
      onClick={() => setActiveCategory(category)}
      whileHover={{ scale: 1.05 }}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </motion.button>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Document Review Portal
      </motion.h1>

      {/* Search Bar */}
      <motion.div
        className="relative mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center bg-white rounded-lg px-4 py-3 shadow-sm ring-1 ring-gray-200 hover:ring-blue-500 transition-all">
          <FaSearch className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full outline-none bg-transparent placeholder-gray-400"
          />
        </div>
      </motion.div>

      {/* Documents Table */}
      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-medium text-gray-700">
                User
              </th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">
                documents
              </th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentRequests.map((request) => (
              <motion.tr
                key={request.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedRequest(request)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {request.user}
                  </div>
                  <div className="text-sm text-gray-500">{request.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(request.documents).map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-blue-50 rounded-full text-sm text-blue-700 capitalize"
                      >
                        {category} ({request.documents[category].length})
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={request.status} />
                </td>
                <td className="px-6 py-4">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRequests((prev) =>
                        prev.filter((r) => r.id !== request.id)
                      );
                      toast.success("Document deleted");
                    }}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FaTrash className="text-lg" />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <Modal
        selectedRequest={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        newComment={newComment}
        setNewComment={setNewComment}
        handleStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default Requests;
