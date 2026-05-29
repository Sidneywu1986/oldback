const API_BASE = import.meta.env.VITE_API_BASE || "/api/v1";

export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

export class ApiError extends Error {
  code: number;
  constructor(code: number, msg: string) {
    super(msg);
    this.code = code;
    this.name = "ApiError";
  }
}

const controllers = new Map<string, AbortController>();

async function request<T>(method: string, url: string, data?: any, signal?: AbortSignal): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    signal,
  };
  if (data && method !== "GET") {
    config.body = JSON.stringify(data);
  }

  let fullUrl = `${API_BASE}${url}`;
  if (method === "GET" && data) {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) params.append(k, String(v));
    });
    if (params.toString()) fullUrl += `?${params.toString()}`;
  }

  const res = await fetch(fullUrl, config);
  const json = await res.json();
  if (json.code === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.hash = "#/login";
    throw new ApiError(401, "未登录或 token 已过期");
  }
  if (json.code !== 200) {
    throw new ApiError(json.code, json.message || "请求失败");
  }
  return json.data;
}

function makeRequest<T>(method: string, url: string, data?: any, signal?: AbortSignal): Promise<T> {
  return request<T>(method, url, data, signal);
}

export const api = {
  get: <T,>(url: string, params?: any, signal?: AbortSignal) => makeRequest<T>("GET", url, params, signal),
  post: <T,>(url: string, data?: any, signal?: AbortSignal) => makeRequest<T>("POST", url, data, signal),
  put: <T,>(url: string, data?: any, signal?: AbortSignal) => makeRequest<T>("PUT", url, data, signal),
  del: <T,>(url: string, signal?: AbortSignal) => makeRequest<T>("DELETE", url, undefined, signal),
  abort: (key: string) => {
    const ctrl = controllers.get(key);
    if (ctrl) {
      ctrl.abort();
      controllers.delete(key);
    }
  },
  createSignal: (key: string) => {
    api.abort(key);
    const ctrl = new AbortController();
    controllers.set(key, ctrl);
    return ctrl.signal;
  },
};
