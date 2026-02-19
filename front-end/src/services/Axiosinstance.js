import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const path = window.location.pathname;

    // ❌ login / signup pe redirect mat karo
    if (
      status === 401 &&
      !path.includes("/login") &&
      !path.includes("/signup")
    ) {
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default api;

