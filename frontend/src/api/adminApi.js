export const fetchAdminUsers = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/v1/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      
    });
  
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  };
  
  export const fetchAdminRequests = async (filters = {}) => {
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams();
    
    if (filters.type) {
      queryParams.append('type', filters.type);
    }
    if (filters.department) {
      queryParams.append('department', filters.department);
    }

    const url = `http://localhost:5000/api/v1/admin/requests?${queryParams.toString()}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) throw new Error('Failed to fetch requests');
    return response.json();
  };
  
  // api/adminApi.js
export const fetchCurrentAdmin = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5000/api/v1/admin/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to fetch admin');
  const data = await res.json();
  return data.data.admin; // Only return the admin object
};

import axios from "axios";

// Adjust depending on who is logged in
export const fetchRequestsForCurrentAdmin = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`http://localhost:5000/api/v1/admin/requestsRelated`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  const requests = res.data.data;

  if (!Array.isArray(requests)) {
    throw new Error("Expected array of requests");
  }

  console.log("Fetched Requests:", requests);
  return requests;
};

// ✅ Submit a decision for review
export const submitReviewDecision = async ({ role, requestId, decision, message, feedbackMessage, attachments, feedbackAttachments }) => {
  let endpoint = "";

  switch (role) {
    case "partnership-division":
      endpoint = `http://localhost:5000/api/v1/admin/review/partnership`;
      break;
    case "law-service":
      endpoint = `http://localhost:5000/api/v1/admin/review/law-service`;
      break;
    case "law-research":
      endpoint = `http://localhost:5000/api/v1/admin/review/law-research`;
      break;
    case "director":
      endpoint = `http://localhost:5000/api/v1/admin/review/director`;
      break;
    case "general-director":
      endpoint = `http://localhost:5000/api/v1/admin/review/general-director`;
      break;
    default:
      throw new Error("Invalid role for review");
  }

  const formData = new FormData();
  formData.append('requestId', requestId);
  formData.append('decision', decision);
  formData.append('message', message || '');
  formData.append('feedbackMessage', feedbackMessage || '');

  if (attachments && attachments.length > 0) {
    attachments.forEach(file => {
      formData.append('attachments', file);
    });
  }

  if (feedbackAttachments && feedbackAttachments.length > 0) {
    feedbackAttachments.forEach(file => {
      formData.append('feedbackAttachments', file);
    });
  }

  const res = await axios.post(endpoint, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });

  return res.data;
};

export const fetchReviewedRequests = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:5000/api/v1/admin/my-reviewed-requests", {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data.data;
};

// Partnership Reviewed Requests Functions
export const fetchPartnershipReviewedRequests = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:5000/api/v1/admin/partnership-reviewed", {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  return response.data.data;
};

// Partner Management Functions
export const fetchPartners = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:5000/api/v1/partners", {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  return response.data.data;
};

export const fetchPartnerById = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:5000/api/v1/partners/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  return response.data.data;
};

export const fetchSignedPartners = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:5000/api/v1/partners/signed", {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  return response.data.data;
};

export const fetchUnsignedPartners = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:5000/api/v1/partners/unsigned", {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  return response.data.data;
};

export const signPartner = async (partnerId) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch(
    `http://localhost:5000/api/v1/partners/${partnerId}/sign`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    }
  );
  return response.data;
};

export const uploadPartnerAttachment = async ({ partnerId, file, description, type }) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("description", description);

  const endpoint = type === "request" 
    ? `http://localhost:5000/api/v1/partners/${partnerId}/request-attachments`
    : `http://localhost:5000/api/v1/partners/${partnerId}/approval-attachments`;

  const response = await axios.post(endpoint, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    },
    withCredentials: true
  });
  return response.data;
};

export const removePartnerAttachment = async ({ partnerId, attachmentId, type }) => {
  const token = localStorage.getItem("token");
  const endpoint = type === "request"
    ? `http://localhost:5000/api/v1/partners/${partnerId}/request-attachments/${attachmentId}`
    : `http://localhost:5000/api/v1/partners/${partnerId}/approval-attachments/${attachmentId}`;

  const response = await axios.delete(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  return response.data;
};

// Law Related Requests Functions
export const fetchLawServiceRequests = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:5000/api/v1/admin/law-service-requests", {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  return response.data.data;
};

export const fetchLawResearchRequests = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:5000/api/v1/admin/law-research-requests", {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  return response.data.data;
};

export const forwardToGeneralDirector = async (requestId) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    "http://localhost:5000/api/v1/admin/partnership/forward-to-general-director",
    { requestId },
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    }
  );
  return response.data;
};

// Dashboard Functions
export const fetchDashboardData = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:5000/api/v1/admin/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  return response.data.data;
};

// Request Detail Functions
export const fetchRequest = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  try {
    const response = await axios.get(`http://localhost:5000/api/v1/admin/requests/${id}`, {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
      withCredentials: true
    });

    // Return the data directly since the response already contains the request data
    return response.data.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch request details");
    }
    throw new Error("Failed to fetch request details");
  }
};

export const submitReview = async ({
  id,
  decision,
  currentStage,
  isLawServiceRelated,
  isLawResearchRelated,
  message,
  feedbackMessage,
  frameworkType,
  attachments,
  feedbackAttachments,
  forDirector,
  duration,
  partnershipRequestType
}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const formData = new FormData();
  formData.append("requestId", id);
  formData.append("decision", decision);
  formData.append("message", message);
  formData.append("feedbackMessage", feedbackMessage);

  // Add attachments if any
  if (attachments?.length > 0) {
    attachments.forEach(file => {
      formData.append("attachments", file);
    });
  }

  // Add feedback attachments if any
  if (feedbackAttachments?.length > 0) {
    feedbackAttachments.forEach(file => {
      formData.append("feedbackAttachments", file);
    });
  }

  // Add stage-specific data
  if (currentStage === "partnership-division") {
    formData.append("isLawServiceRelated", isLawServiceRelated);
    formData.append("isLawResearchRelated", isLawResearchRelated);
    formData.append("frameworkType", frameworkType);
    formData.append("forDirector", forDirector);
    formData.append("duration", JSON.stringify(duration));
    formData.append("partnershipRequestType", partnershipRequestType);
  }

  // Use the correct endpoint based on the current stage
  let endpoint;
  switch (currentStage) {
    case "partnership-division":
      endpoint = "http://localhost:5000/api/v1/admin/review/partnership";
      break;
    case "law-service":
      endpoint = "http://localhost:5000/api/v1/admin/review/law-service";
      break;
    case "law-research":
      endpoint = "http://localhost:5000/api/v1/admin/review/law-research";
      break;
    case "director":
      endpoint = "http://localhost:5000/api/v1/admin/director/review";
      break;
    case "general-director":
      endpoint = "http://localhost:5000/api/v1/admin/review/general-director";
      break;
    default:
      throw new Error("Invalid stage for review");
  }

  const response = await axios.post(endpoint, formData, {
      headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
      },
      withCredentials: true
  });

  return response.data;
};

export const fetchReviewedRequestById = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`http://localhost:5000/api/v1/admin/my-reviewed-requests/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data.data;
};
