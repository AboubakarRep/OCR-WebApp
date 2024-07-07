import api from "./api";
import TokenService from "./token.service";

class AuthService {
// const API_URL = "http://localhost:8083/api/auth/";

 register = (username, email, password) => {
  // return axios.post(API_URL + "signup", {
    return api
    .post("/api/auth/signup", {
    username,
    email,
    password,
  });
};

 login = (username, password) => {
  // return axios
  //   .post(API_URL + "signin", {
    return api
    .post("/api/auth/signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        // localStorage.setItem("user", JSON.stringify(response.data));
        TokenService.setUser(response.data);
      }

      return response.data;
    });
};



/*const*/ logout = () => {
  // localStorage.removeItem("user");
  TokenService.removeUser();

};

 getCurrentUser = () => {
  // return JSON.parse(localStorage.getItem("user"));
  return TokenService.getUser();

};
}

const authServiceInstance = new AuthService();
export default authServiceInstance;

