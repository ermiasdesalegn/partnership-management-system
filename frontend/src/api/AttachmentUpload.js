import React, { useState } from 'react';
import axios from 'axios';

const AttachmentUpload = ({ requestId, isAdmin }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    try {
      const endpoint = isAdmin 
        ? `/api/requests/${requestId}/attachments`
        : `/api/user/requests/${requestId}/attachments`;

      await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh request data
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="p-4 border rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-2">Attach PDF</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </form>
    </div>
  );
};