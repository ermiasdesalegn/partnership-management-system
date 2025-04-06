import React, { useState, useRef, useEffect } from "react";
import FileUploadForm from "./FileUpload";

const ProgressDetail = () => {
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);

  const modalRef = useRef(null);

  const profile = {
    address: "Hossana",
    areaOfCooperation: "Education",
    companyName: "Wachemo",
    companyType: "Educational",
    createdAt: "2025-01-30T08:11:00.064Z",
    partnershipType: "Project",
    partnershipStatus: "In progress",
  };

  const handleSendReviewClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showModal]);

  // Handle file upload and create new reviews
  const handleFileUpload = (uploadedFiles) => {
    if (uploadedFiles.length > 0) {
      const newReviews = uploadedFiles.map((file, index) => ({
        id: reviews.length + index + 1,
        sentAt: new Date().toLocaleString(),
        fileName: file.name, // Use the file name
        managerOne: "Pending",
        managerTwo: "Pending",
      }));

      setReviews([...reviews, ...newReviews]);
      closeModal(); // Close modal after upload
    }
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-4xl p-8 md:p-12 lg:p-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
          {profile.companyName}
        </h2>
        <div className="space-y-3 ps-8">
          <DetailItem label="Company Type" value={profile.companyType} />
          <DetailItem label="Address" value={profile.address} />
          <DetailItem
            label="Area of Cooperation"
            value={profile.areaOfCooperation}
          />
          <DetailItem
            label="Partnership Type"
            value={profile.partnershipType}
          />
          <DetailItem
            label="Partnership Status"
            value={profile.partnershipStatus}
          />
          <DetailItem
            label="Created At"
            value={new Date(profile.createdAt).toLocaleString()}
          />
        </div>
      </div>

      {/* Send Review Button */}
      <div className="flex justify-center mt-6">
        <button
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
          onClick={handleSendReviewClick}
        >
          Send for Review
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
            >
              &times;
            </button>
            <FileUploadForm onFileUpload={handleFileUpload} />
          </div>
        </div>
      )}

      {/* Reviews Table */}
      <div className="max-w-5xl mx-auto mt-10">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Sent Reviews
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-6 text-left border">Review ID</th>
                <th className="py-3 px-6 text-left border">Sent At</th>
                <th className="py-3 px-6 text-left border">File Name</th>
                <th className="py-3 px-6 text-left border">Manager One</th>
                <th className="py-3 px-6 text-left border">Manager Two</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-6 border">{review.id}</td>
                  <td className="py-3 px-6 border">{review.sentAt}</td>
                  <td className="py-3 px-6 border font-medium text-blue-600">
                    {review.fileName}
                  </td>
                  <td
                    className={`py-3 px-6 border font-semibold ${
                      review.managerOne === "Approved"
                        ? "text-green-600"
                        : review.managerOne === "Under Review"
                        ? "text-yellow-600"
                        : review.managerOne === "Rejected"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {review.managerOne}
                  </td>
                  <td
                    className={`py-3 px-6 border font-semibold ${
                      review.managerTwo === "Approved"
                        ? "text-green-600"
                        : review.managerTwo === "Under Review"
                        ? "text-yellow-600"
                        : review.managerTwo === "Rejected"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {review.managerTwo}
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No reviews sent yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col md:flex-row justify-between border-b pb-3 text-lg">
    <span className="text-gray-700 font-semibold">{label}:</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

export default ProgressDetail;
