import axios from "axios";

// Create Axios instance
const fb = axios.create({
  baseURL: `${process.env.FACEBOOK_API_URL}/${process.env.FACEBOOK_API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor → must return config
fb.interceptors.request.use(
  (config) => {
    // If token provided dynamically per request
    if (config.meta?.accessToken) {
      config.headers["Authorization"] = `Bearer ${config.meta.accessToken}`;
    }

    return config; // IMPORTANT: must return config
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor → handle 401 if needed
fb.interceptors.response.use(
  (response) => response.data, // this gives you the actual FB response
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          resolve(fb(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default fb;
