import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

/**
 * Generic HTTP service using Axios.
 * Base URL: https://entix.com/api/v1
 */
class HttpService {
  private client: AxiosInstance;

  constructor(baseURL: string = "http://localhost:8787") {
    this.client = axios.create({
      baseURL,
      timeout: 15000, // 15 seconds
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // ✅ Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Example: attach auth token if available
        const token = localStorage.getItem("access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response) {
          console.error(
            `[HTTP ${error.response.status}] ${error.response.config.url}`,
            error.response.data
          );
        } else {
          console.error("[HTTP Error]", error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Generic GET method
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.get<T>(url, config);
    return res.data;
  }

  /**
   * Generic POST method
   */
  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.client.post<T>(url, data, config);
    return res.data;
  }

  /**
   * Generic PUT method
   */
  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.client.put<T>(url, data, config);
    return res.data;
  }

  /**
   * Generic DELETE method
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.delete<T>(url, config);
    return res.data;
  }
}

// ✅ Singleton instance
const http = new HttpService();
export default http;
