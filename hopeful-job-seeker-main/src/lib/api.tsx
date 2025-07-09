import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api"; // Change this if your backend runs on a different port or path

// --- Auth ---
export const register = (data: any) => axios.post(`${API_BASE_URL}/auth/register`, data);
export const login = (data: any) => axios.post(`${API_BASE_URL}/auth/login`, data);

// --- Jobs (User) ---
export const getAllJobs = () => axios.get(`${API_BASE_URL}/userjobs/jobs`);
export const getJobById = (id: string) => axios.get(`${API_BASE_URL}/userjobs/jobs/${id}`);
export const applyToJob = (id: string, data: any) => axios.post(`${API_BASE_URL}/userjobs/jobs/${id}/apply`, data, { withCredentials: true });
export const getUserApplications = () => axios.get(`${API_BASE_URL}/userjobs/jobs/applied`, { withCredentials: true });

// --- Jobs (Admin) ---
export const getAllJobsAdmin = () => axios.get(`${API_BASE_URL}/userjobs/admin/jobs`, { withCredentials: true });
export const createJob = (data: any) => axios.post(`${API_BASE_URL}/userjobs/admin/jobs`, data, { withCredentials: true });
export const getJobByIdAdmin = (id: string) => axios.get(`${API_BASE_URL}/userjobs/admin/jobs/${id}`, { withCredentials: true });
export const updateJob = (id: string, data: any) => axios.patch(`${API_BASE_URL}/userjobs/admin/jobs/${id}`, data, { withCredentials: true });
export const deleteJob = (id: string) => axios.delete(`${API_BASE_URL}/userjobs/admin/jobs/${id}`, { withCredentials: true });

// --- Applications ---
export const listApplications = (userId?: string) => axios.get(`${API_BASE_URL}/manageapplication/${userId ? `?userId=${userId}` : ''}`);
export const getApplication = (id: string) => axios.get(`${API_BASE_URL}/manageapplication/${id}`);
export const createApplication = (data: any) => axios.post(`${API_BASE_URL}/manageapplication/`, data);
export const updateApplication = (id: string, data: any) => axios.put(`${API_BASE_URL}/manageapplication/${id}`, data);
export const deleteApplication = (id: string) => axios.delete(`${API_BASE_URL}/manageapplication/${id}`);

// --- Interviews ---
export const listInterviews = (candidateId?: string) => axios.get(`${API_BASE_URL}/interviews/${candidateId ? `?candidate=${candidateId}` : ''}`);
export const getInterview = (id: string) => axios.get(`${API_BASE_URL}/interviews/${id}`);
export const createInterview = (data: any) => axios.post(`${API_BASE_URL}/interviews/`, data);
export const updateInterview = (id: string, data: any) => axios.put(`${API_BASE_URL}/interviews/${id}`, data);
export const deleteInterview = (id: string) => axios.delete(`${API_BASE_URL}/interviews/${id}`);

// --- User Management ---
export const getUserActivity = () => axios.get(`${API_BASE_URL}/manageusers/activity`);
export const getRoleCounts = () => axios.get(`${API_BASE_URL}/manageusers/roles`);
export const exportUsers = () => axios.get(`${API_BASE_URL}/manageusers/export`);

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}

// --- Test Generator ---
export const createTest = (data: any) => axios.post(`${API_BASE_URL}/tests/create`, data, authHeaders());
export const listTests = () => axios.get(`${API_BASE_URL}/tests/all`, authHeaders());
export const assignTest = (data: any) => axios.post(`${API_BASE_URL}/tests/assign`, data, authHeaders());
export const listAssignedTests = () => axios.get(`${API_BASE_URL}/tests/assigned`, authHeaders());
export const listMyTests = (candidateId?: string) => axios.get(`${API_BASE_URL}/tests/my${candidateId ? `?candidateId=${candidateId}` : ''}`, authHeaders());
export const submitTest = (data: any) => axios.post(`${API_BASE_URL}/tests/submit`, data, authHeaders());
export const deleteTest = (id: string) => axios.delete(`${API_BASE_URL}/tests/${id}`, authHeaders());
export const updateTest = (id: string, data: any) => axios.put(`${API_BASE_URL}/tests/${id}`, data, authHeaders());
export const getAllUsers = () => axios.get(`${API_BASE_URL}/manageusers/activity`, authHeaders()); 