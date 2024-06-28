import axios from "axios";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line no-undef
const url = process.env.REACT_APP_API_URL;
const navigate = useNavigate();

const api = axios.create({
  baseURL: `${url}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      navigate("/sign-in");
    }
    return Promise.reject(error);
  }
);

const setInterceptors = () => {
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        navigate("/sign-in");
      }
      return Promise.reject(error);
    }
  );
};

export { api, setInterceptors };
