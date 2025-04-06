const ReportModal = ({ partner, onClose }) => {
  const handleViewReport = (pdfUrl) => {
    // Open the PDF in a new browser tab
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 animate-fadeIn">
        <h3 className="text-lg font-semibold mb-4">{partner.name} - Reports</h3>

        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Last Report Date:</span> {partner.lastReportDate}
        </p>

        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Report Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">View</th>
              </tr>
            </thead>
            <tbody>
              {partner.reports.map((report, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleViewReport(report.pdfUrl)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full transition-colors"
          aria-label="Close report modal"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ReportModal;
