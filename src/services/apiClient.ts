// src/services/apiClient.ts
//const API_BASE_URL = 'https://produce-first-back.onrender.com/api';
const API_BASE_URL = 'http://localhost:3000/api';
const DEFAULT_TIMEOUT = 30000;

const ENABLE_REQUEST_LOGS = true;

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeToRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
};

const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
};

// Helpers para localStorage
const storage = {
    getItem: (key: string) => localStorage.getItem(key),
    setItem: (key: string, value: string) => localStorage.setItem(key, value),
    removeItem: (key: string) => localStorage.removeItem(key),
};

interface ApiClientOptions extends RequestInit {
    token?: string;
    skipAuth?: boolean;
    timeout?: number;
}

interface ApiErrorDetails {
    status: number;
    statusText: string;
    endpoint: string;
    method: string;
    requestBody?: any;
    responseBody?: any;
    message: string;
}

export class ApiError extends Error {
    details: ApiErrorDetails;

    constructor(details: ApiErrorDetails) {
        super(details.message);
        this.name = 'ApiError';
        this.details = details;
    }
}

export const apiClient = async <T = any>(
    endpoint: string,
    options: ApiClientOptions = {}
): Promise<T> => {
    const method = options.method || 'GET';
    if (ENABLE_REQUEST_LOGS) {
        console.log(`📡 [${method}] ${endpoint}`);
    }

    const executeRequest = async (customToken?: string) => {
        const { token, skipAuth, timeout = DEFAULT_TIMEOUT, ...customOptions } = options;
        const finalToken = customToken || token;

        const isFormData = customOptions.body instanceof FormData;

        const headers = {
            ...(finalToken ? { Authorization: `Bearer ${finalToken}` } : {}),
            ...(isFormData
                ? {}
                : { 'Content-Type': 'application/json', Accept: 'application/json' }),
            ...customOptions.headers,
        };

        const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
            ...customOptions,
            headers,
        }, timeout);

        const responseText = await response.text();

        let responseData;
        let parseError;
        try {
            responseData = responseText ? JSON.parse(responseText) : null;
        } catch (e) {
            parseError = e;
            responseData = { raw: responseText };
        }

        if (ENABLE_REQUEST_LOGS) {
            console.log(`📡 [${method}] ${endpoint} → ${response.status} ${response.statusText}`);
        }

        return {
            response,
            responseText,
            responseData,
            parseError
        };
    };

    try {
        const currentToken = storage.getItem('produce_first_token');
        let { response, responseText, responseData, parseError } = await executeRequest(currentToken || undefined);

        if (parseError) {
            console.error('❌ Error parseando respuesta JSON:', {
                endpoint,
                status: response.status,
                responseText: responseText.substring(0, 200),
                parseError: parseError
            });

            throw new ApiError({
                status: response.status,
                statusText: response.statusText,
                endpoint,
                method: options.method || 'GET',
                requestBody: options.body,
                responseBody: { raw: responseText.substring(0, 500) },
                message: `Error parseando respuesta: ${parseError}`
            });
        }

        // Manejo de 401 - Token expirado
        if (response.status === 401 && !options.skipAuth) {
            const isLoginEndpoint = endpoint === '/auth/login' || endpoint === '/auth/signin';
            
            if (isLoginEndpoint) {
                console.log('❌ Login falló con 401 - Credenciales incorrectas');
                
                storage.removeItem('produce_first_token');
                storage.removeItem('produce_first_refresh_token');
                
                throw new ApiError({
                    status: response.status,
                    statusText: response.statusText,
                    endpoint,
                    method: options.method || 'GET',
                    requestBody: options.body,
                    responseBody: responseData,
                    message: responseData?.error || 'Credenciales incorrectas'
                });
            }

            console.log('🔑 Token expirado, intentando refrescar...');

            if (isRefreshing) {
                console.log('⏳ Refresh en progreso, esperando...');
                return new Promise((resolve, reject) => {
                    subscribeToRefresh(async (newToken) => {
                        try {
                            const retryResult = await executeRequest(newToken);
                            if (!retryResult.response.ok) {
                                reject(new ApiError({
                                    status: retryResult.response.status,
                                    statusText: retryResult.response.statusText,
                                    endpoint,
                                    method: options.method || 'GET',
                                    requestBody: options.body,
                                    responseBody: retryResult.responseData,
                                    message: retryResult.responseData?.message || `Error ${retryResult.response.status}`
                                }));
                                return;
                            }
                            resolve(retryResult.responseData as T);
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
            }

            isRefreshing = true;

            try {
                const refreshToken = storage.getItem('produce_first_refresh_token');

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                console.log('🔄 Refrescando token...');

                const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                });

                const refreshData = await refreshResponse.json();

                if (!refreshResponse.ok) {
                    console.log('❌ Refresh token falló:', { status: refreshResponse.status, data: refreshData });

                    storage.removeItem('produce_first_token');
                    storage.removeItem('produce_first_refresh_token');

                    onRefreshed('');
                    isRefreshing = false;

                    // Redirigir al login
                    window.location.href = '/login';
                    throw new Error('Sesión expirada. Por favor, inicia sesión de nuevo.');
                }

                const newAccessToken = refreshData.data?.accessToken || refreshData.accessToken;

                if (!newAccessToken) {
                    throw new Error('Nuevo token con formato inválido');
                }

                storage.setItem('produce_first_token', newAccessToken);
                if (refreshData.data?.refreshToken) {
                    storage.setItem('produce_first_refresh_token', refreshData.data.refreshToken);
                }

                console.log('✅ Token refrescado exitosamente');

                onRefreshed(newAccessToken);
                isRefreshing = false;

                const retryResult = await executeRequest(newAccessToken);

                if (!retryResult.response.ok) {
                    throw new ApiError({
                        status: retryResult.response.status,
                        statusText: retryResult.response.statusText,
                        endpoint,
                        method: options.method || 'GET',
                        requestBody: options.body,
                        responseBody: retryResult.responseData,
                        message: retryResult.responseData?.message || `Error ${retryResult.response.status}`
                    });
                }

                return retryResult.responseData as T;

            } catch (refreshError) {
                console.error('❌ Error refreshing token:', refreshError);
                isRefreshing = false;
                refreshSubscribers = [];

                storage.removeItem('produce_first_token');
                storage.removeItem('produce_first_refresh_token');

                window.location.href = '/login';
                throw refreshError;
            }
        }

        if (!response.ok) {
            throw new ApiError({
                status: response.status,
                statusText: response.statusText,
                endpoint,
                method: options.method || 'GET',
                requestBody: options.body,
                responseBody: responseData,
                message: responseData?.message || responseData?.error || `Error ${response.status}`
            });
        }

        return responseData as T;

    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError({
            status: 0,
            statusText: 'Unknown Error',
            endpoint,
            method: options.method || 'GET',
            requestBody: options.body,
            responseBody: null,
            message: error instanceof Error ? error.message : String(error)
        });
    }
};

export const api = {
    get: <T = any>(endpoint: string, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
        apiClient<T>(endpoint, { ...options, method: 'GET' }),

    post: <T = any>(endpoint: string, data?: any, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
        apiClient<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),

    put: <T = any>(endpoint: string, data?: any, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
        apiClient<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),

    delete: <T = any>(endpoint: string, options?: Omit<ApiClientOptions, 'method'>) =>
        apiClient<T>(endpoint, { ...options, method: 'DELETE' }),

    patch: <T = any>(endpoint: string, data?: any, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
        apiClient<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),

    upload: <T = any>(endpoint: string, formData: FormData, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
        apiClient<T>(endpoint, { ...options, method: 'PUT', body: formData }),
        
    uploadPost: <T = any>(endpoint: string, formData: FormData, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
        apiClient<T>(endpoint, { ...options, method: 'POST', body: formData }),
};