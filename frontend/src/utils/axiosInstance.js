import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem('token');

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // ACCESS TOKEN EXPIRED
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken =
          localStorage.getItem('refreshToken');

        const res = await axios.post(
          'http://localhost:5000/auth/refresh',
          {
            refreshToken,
          }
        );

        const newAccessToken =
          res.data.accessToken;

        localStorage.setItem(
          'token',
          newAccessToken
        );

        // UPDATE HEADER
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // RETRY REQUEST
        return axiosInstance(originalRequest);

      } catch (err) {

        // REFRESH FAILED
        localStorage.removeItem('token');

        localStorage.removeItem('refreshToken');

        localStorage.removeItem('role');

        window.location.href = '/login';

      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;