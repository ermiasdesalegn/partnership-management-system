import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ReportModal = ({ partner, onClose }) => {
  const [activeTab, setActiveTab] = useState("request");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen px-8 py-10 bg-gradient-to-br from-white via-[#3c8dbc]/5 to-[#3c8dbc]/10 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#3c8dbc] mx-auto" />
        </div>
      </div>
    );
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      if (description) {
        formData.append("description", description);
      }

      const endpoint = activeTab === "request" 
        ? `/api/v1/partners/${partner._id}/request-attachments`
        : `/api/v1/partners/${partner._id}/approval-attachments`;

      await axios.post(endpoint, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      toast.success("File uploaded successfully");
      setFile(null);
      setDescription("");
      onClose(); // Close the modal first
      window.location.reload(); // Then reload the page
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAttachment = async (attachmentId) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = activeTab === "request"
        ? `/api/v1/partners/${partner._id}/request-attachments/${attachmentId}`
        : `/api/v1/partners/${partner._id}/approval-attachments/${attachmentId}`;

      await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      toast.success("Attachment removed successfully");
      onClose(); // Close the modal first
      window.location.reload(); // Then reload the page
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove attachment");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-text-100)]">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[var(--color-text-h1)]">
              {partner.companyName} - Attachments
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--color-text-600)] hover:text-[var(--color-text-800)]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab("request")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "request"
                  ? "bg-[var(--color-btn-default)] text-white"
                  : "bg-[var(--color-text-50)] text-[var(--color-text-700)] hover:bg-[var(--color-text-100)]"
              }`}
            >
              Request Attachments
            </button>
            <button
              onClick={() => setActiveTab("approval")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "approval"
                  ? "bg-[var(--color-btn-default)] text-white"
                  : "bg-[var(--color-text-50)] text-[var(--color-text-700)] hover:bg-[var(--color-text-100)]"
              }`}
            >
              Approval Attachments
            </button>
          </div>

          <form onSubmit={handleUpload} className="mb-6 bg-[var(--color-text-50)] p-4 rounded-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-700)] mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-text-200)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-btn-default)]"
                  placeholder="Enter file description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-700)] mb-1">
                  File
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-[var(--color-text-200)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-btn-default)]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-[var(--color-btn-default)] text-white rounded-md hover:bg-[var(--color-btn-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-btn-default)] transition-colors disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload File"}
              </button>
            </div>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-[var(--color-text-100)]">
              <thead>
                <tr className="bg-[var(--color-text-50)]">
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-700)] uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-700)] uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-700)] uppercase tracking-wider">
                    Uploaded By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-700)] uppercase tracking-wider">
                    Upload Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-700)] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-700)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-text-100)]">
                {(activeTab === "request" ? partner.requestAttachments : partner.approvalAttachments)?.map((attachment) => (
                  <tr key={attachment._id} className="hover:bg-[var(--color-text-50)]">
                    <td className="px-6 py-4 text-sm text-[var(--color-text-700)]">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-[var(--color-text-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span>{attachment.originalName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-700)]">
                      {attachment.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-700)]">
                      {attachment.uploadedBy?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-700)]">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        attachment.uploaderModel === 'Admin' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {attachment.uploaderModel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-700)]">
                      {new Date(attachment.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <a
                          href={`http://localhost:5000/public/uploads/${attachment.path.split('uploads/').pop()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-btn-default)] hover:text-[var(--color-btn-hover)]"
                        >
                          Download
                        </a>
                        <button
                          onClick={() => handleRemoveAttachment(attachment._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
