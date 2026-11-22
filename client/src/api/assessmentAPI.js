import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/assessments`;

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fail = (error, fallback) => ({
  success: false,
  status: error.response ? error.response.status : null,
  message:
    (error.response && error.response.data && error.response.data.message) ||
    fallback,
  fields: (error.response && error.response.data && error.response.data.fields) || [],
  code: (error.response && error.response.data && error.response.data.code) || null,
});

// ---- Public ----
export async function getAssessmentForm() {
  try {
    const res = await axios.get(`${API_URL}/form`);
    return res.data;
  } catch (error) {
    return fail(error, "Failed to load the form");
  }
}

export async function submitAssessment(payload) {
  try {
    const res = await axios.post(API_URL, payload);
    return res.data;
  } catch (error) {
    return fail(error, "Failed to submit");
  }
}

export async function getAssessmentResult(publicId) {
  try {
    const res = await axios.get(`${API_URL}/result/${publicId}`);
    return res.data;
  } catch (error) {
    return fail(error, "Failed to load the report");
  }
}

// ---- Admin ----
export async function listAssessments() {
  try {
    const res = await axios.get(API_URL, { headers: authHeaders() });
    return res.data;
  } catch (error) {
    return fail(error, "Failed to load assessments");
  }
}

export async function getAssessment(id) {
  try {
    const res = await axios.get(`${API_URL}/${id}`, { headers: authHeaders() });
    return res.data;
  } catch (error) {
    return fail(error, "Failed to load the assessment");
  }
}

export async function updateAssessment(id, data) {
  try {
    const res = await axios.patch(`${API_URL}/${id}`, data, { headers: authHeaders() });
    return res.data;
  } catch (error) {
    return fail(error, "Failed to update");
  }
}

export async function regenerateAssessment(id) {
  try {
    const res = await axios.post(`${API_URL}/${id}/regenerate`, {}, { headers: authHeaders() });
    return res.data;
  } catch (error) {
    return fail(error, "Failed to regenerate");
  }
}

export async function deleteAssessment(id) {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, { headers: authHeaders() });
    return res.data;
  } catch (error) {
    return fail(error, "Failed to delete");
  }
}
