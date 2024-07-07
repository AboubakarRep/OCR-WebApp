import api from './api';

// const API_URL = "http://localhost:8083/api/test/";

const getPublicContent = () => {
  // return axios.get(API_URL + "all");
  return api.get('/api/test/all');
};

const getUserBoard = () => {
  // return axios.get(API_URL + "user", { headers: authHeader() });
  return api.get('/api/test/user');
};

const getModeratorBoard = () => {
  // return axios.get(API_URL + "mod", { headers: authHeader() });
  return api.get('/api/test/mod');
};

const getAdminBoard = () => {
  // return axios.get(API_URL + "admin", { headers: authHeader() });
  return api.get('/api/test/admin');
};

const UserService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};

export default UserService;
