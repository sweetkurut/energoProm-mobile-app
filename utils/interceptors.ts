import { getAccessToken, getRefreshToken, removeTokens, saveTokens } from "@/utils/auth";
import { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const setupInterceptors = (instance: AxiosInstance): AxiosInstance => {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const token = await getAccessToken();
        if (token && config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      } catch (error) {
        console.error("Ошибка в интерцепторе запроса:", error);
        return config;
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as ExtendedAxiosRequestConfig;

      if (!error.response || error.response.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (originalRequest.url === "/accounts/token/refresh/") {
        await removeTokens();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          await removeTokens();
          processQueue(new Error("Нет refresh токена"));
          isRefreshing = false;
          return Promise.reject(error);
        }

        const response = await instance.post("/accounts/token/refresh/", {
          refresh: refreshToken,
        });

        const { access, refresh } = response.data;

        await saveTokens(access, refresh);

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${access}`;
        }

        processQueue(null, access);

        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        await removeTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );

  return instance;
};
