import { useEffect, useState } from "react";
import ReportModal from "./ReportModal";

const partners = [
  { 
    id: 1, name: "Partner A", industry: "Tech", location: "USA", state: "Active", 
    lastReportDate: "2025-02-10", 
    reports: [
      { name: "Report 1", pdfUrl: "/pdf/re.pdf" }, 
      { name: "Report 2", pdfUrl: "/path/to/report2.pdf" }
    ]
  },
  { 
    id: 2, name: "Partner B", industry: "Finance", location: "UK", state: "Pending", 
    lastReportDate: "2025-01-20", 
    reports: [
      { name: "Report 3", pdfUrl: "/path/to/report3.pdf" }
    ]
  },
  { 
    id: 3, name: "Partner C", industry: "Healthcare", location: "Canada", state: "Suspended", 
    lastReportDate: "2024-12-15", 
    reports: [
      { name: "Report 4", pdfUrl: "/path/to/report4.pdf" }
    ]
  },
];

const PartnerReports = () => {
  const headers = ["ID", "Name", "Industry", "Location", "State", "Last Report Date", "Actions"];
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setData(partners);
    } catch (err) {
      setError("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const openModal = (partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error || "Something went wrong"}</h2>;

  return (
    <div className="w-full min-h-screen">
      <div className="p-4 w-full">
        <h1 className="text-2xl font-bold mb-4">Partners</h1>
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-6 py-4 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((partner) => (
              <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">{partner.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{partner.name}</td>
                <td className="px-6 py-4 text-gray-700">{partner.industry}</td>
                <td className="px-6 py-4 text-gray-700">{partner.location}</td>
                <td className={`px-6 py-4 font-semibold ${partner.state === "Active" ? "text-green-600" : partner.state === "Pending" ? "text-yellow-600" : "text-red-600"}`}>
                  {partner.state}
                </td>
                <td className="px-6 py-4 text-gray-700">{partner.lastReportDate}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openModal(partner)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    aria-label={`View reports for ${partner.name}`}
                  >
                    View Reports
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <ReportModal partner={selectedPartner} onClose={closeModal} />}
    </div>
  );
};

export default PartnerReports;
