// Modal.jsx
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFilePdf,
  FaTimes,
  FaRegCommentDots,
  FaCheckCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";

const Modal = ({ selectedRequest, onClose, newComment, setNewComment, handleStatusUpdate }) => {
  return (
    <AnimatePresence>
      {selectedRequest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex justify-center items-center p-4 z-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaFilePdf className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedRequest.user}'s Submission
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedRequest.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-2xl text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
              {/* Document List */}
              <div className="lg:col-span-1 space-y-6">
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full">
                    Documents
                  </span>
                </div>
                <div className="flex gap-2 flex-col">
                  {selectedRequest.documents.map((document, index) => (
                    <a
                      key={index}
                      href={`/pdf/${document}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 cursor-pointer transition-colors flex flex-row justify-between items-center"
                    >
                      {index + 1}
                      {". "}
                      {document}
                      <FaExternalLinkAlt className="text-blue-500" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Comment Section */}
              <div className="lg:col-span-2 border-l pl-6 h-[70vh] flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FaRegCommentDots className="text-green-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold">Give your comments</h3>
                </div>

                {/* Comment Input */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="relative">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Type your comment..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                      rows="12"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <motion.button
                      onClick={() => handleStatusUpdate(selectedRequest.id, "approved")}
                      className="flex-1 px-4 py-3 bg-green-300 text-gray-800 rounded-xl hover:bg-green-500 hover:text-white flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                    >
                      <FaCheckCircle /> Send
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;