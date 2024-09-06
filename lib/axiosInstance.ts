import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://beta-api.pattern50.com",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access-token");

    const base64Credentials = btoa(
      process.env.NEXT_PUBLIC_CLIENT_ID +
        ":" +
        process.env.NEXT_PUBLIC_CLIENT_SECRET
    );

    config.headers.Authorization =
      config["url"] === "/auth/sign-in"
        ? `Basic ${base64Credentials}`
        : accessToken
        ? `Bearer ${accessToken}`
        : "";

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const accessToken = localStorage.getItem("access-token");
    const refreshToken = localStorage.getItem("refresh-token");

    if (!accessToken && refreshToken) {
      // regnerate the access token
      const response = await axiosInstance.post("/auth/sign-in", {
        refreshToken: refreshToken,
        grantType: "refreshToken",
      });

      const newRefreshToken = await response.data.auth.refreshToken;
      const newAccessToken = await response.data.auth.accessToken;

      localStorage.setItem("access-token", newAccessToken);
      localStorage.setItem("refresh-token", newRefreshToken);

      window.location.reload();
    }

    if (accessToken && !refreshToken) {
      localStorage.removeItem("access-token");
      localStorage.removeItem("refresh-token");
      localStorage.removeItem("roleType");

      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
