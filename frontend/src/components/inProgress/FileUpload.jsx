import { useState } from "react";

const fileCategories = ["MOU", "NDA", "MOA", "Contract Agreement", "Other"];

const FileUploadForm = ({ onFileUpload }) => {
  const [fileFields, setFileFields] = useState([
    { id: 1, category: "", file: null },
  ]);

  const handleFileChange = (event, id) => {
    const selectedFile = event.target.files[0];
    setFileFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, file: selectedFile } : field
      )
    );
  };

  const handleCategoryChange = (event, id) => {
    setFileFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, category: event.target.value } : field
      )
    );
  };

  const addFileField = () => {
    setFileFields((prevFields) => [
      ...prevFields,
      { id: prevFields.length + 1, category: "", file: null },
    ]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validFiles = fileFields.filter((field) => field.file !== null);

    if (validFiles.length > 0) {
      // Pass the valid files to the parent component
      onFileUpload(validFiles.map((field) => field.file));
      alert("Files uploaded successfully!");
      setFileFields([{ id: 1, category: "", file: null }]); // Reset form
    } else {
      alert("Please select at least one PDF file.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Upload Agreement Documents</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fileFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select File Type
            </label>
            <select
              value={field.category}
              onChange={(e) => handleCategoryChange(e, field.id)}
              className="block w-full text-sm border border-gray-300 rounded-md p-2 focus:outline-none"
            >
              <option value="">-- Select Category --</option>
              {fileCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, field.id)}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
            />

            {field.file && (
              <p className="text-xs text-gray-500">
                Selected: {field.file.name}
              </p>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addFileField}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
        >
          + Add Another File
        </button>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
        >
          Upload Files
        </button>
      </form>
    </div>
  );
};

export default FileUploadForm;