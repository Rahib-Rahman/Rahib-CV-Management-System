import axios from "axios";

export const API = axios.create({ baseURL: "http://localhost:3001/api" });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

// Profile
export const getProfile = () => API.get("/profile");
export const updateProfile = (data) => API.put("/profile", data);

// Projects
export const getProjects = () => API.get("/projects");
export const createProject = (data) => API.post("/projects", data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

// Attributes
export const getAttributes = () => API.get("/attributes");
export const createAttribute = (data) => API.post("/attributes", data);
export const updateAttribute = (id, data) => API.put(`/attributes/${id}`, data);
export const deleteAttribute = (id) => API.delete(`/attributes/${id}`);

// Positions
export const getPositions = () => API.get("/positions");
export const createPosition = (data) => API.post("/positions", data);
export const updatePosition = (id, data) => API.put(`/positions/${id}`, data);
export const deletePosition = (id) => API.delete(`/positions/${id}`);

// CVs
export const getCVs = () => API.get("/cvs");
export const getCV = (id) => API.get(`/cvs/${id}`);
export const createCV = (data) => API.post("/cvs", data);
export const publishCV = (id) => API.put(`/cvs/${id}/publish`);
export const deleteCV = (id) => API.delete(`/cvs/${id}`);

// Discussions
export const getDiscussions = (positionId) => API.get(`/discussions/${positionId}`);
export const addDiscussion = (positionId, data) => API.post(`/discussions/${positionId}`, data);

// Likes
export const getLikes = (cvId) => API.get(`/likes/${cvId}`);
export const addLike = (cvId) => API.post(`/likes/${cvId}`);
export const removeLike = (cvId) => API.delete(`/likes/${cvId}`);

// Main dashboard routes
export const getLatestPositions = () => API.get("/main/latest-positions");
export const getPopularPositions = () => API.get("/main/popular-positions");
export const getTags = () => API.get("/main/tags");

// Search
export const searchPositions = (q) => API.get(`/search/positions?q=${q}`);
export const searchCVs = (q) => API.get(`/search/cvs?q=${q}`);

// Admin
export const getUsers = () => API.get("/admin/users");
export const blockUser = (id) => API.put(`/admin/users/${id}/block`);
export const changeRole = (id, role) => API.put(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

// Badges
export const getBadges = () => API.get("/badges");

// Stats (global + achievements)
export const getStats = () => API.get("/stats");
export const getAchievements = () => API.get("/stats/achievements");

// Reminders
export const getReminders = () => API.get("/reminders");
export const createReminder = (data) => API.post("/reminders", data);
export const deleteReminder = (id) => API.delete(`/reminders/${id}`);

// Audit Logs
export const getAuditLogs = () => API.get("/audit");

// Uploads
export const uploadFile = (formData) => API.post("/upload", formData);

// ExportCVs
export const exportCVsToCSV = (positionId) =>
    API.get(`/export/${positionId}/csv`, { responseType: "blob" });
export const exportCVsToExcel = (positionId) =>
    API.get(`/export/${positionId}/excel`, { responseType: "blob" });

// PDF Export
export const exportCVToPDF = (cvId, lang = "en") =>
    API.get(`/pdf/${cvId}/pdf?lang=${lang}`, { responseType: "blob" });

