import { useCallback, useMemo } from 'react';
import { useApiConfig } from '../context/ApiConfigContext';
import { useAuth } from '../context/AuthContext';
import { mockRouteHandlers } from './mockData';

const USE_MOCK = false;

export function useApiClient() {
  const config = useApiConfig();
  const { token } = useAuth();

  const buildHeaders = useCallback((extra = {}) => {
    const headers = { Accept: 'application/json', ...extra };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }, [token]);

  const getMockResponse = useCallback((path, method, params = {}, body = null, headers = {}) => {
    let key = `${method} ${path}`;
    if (Object.keys(params).length > 0) {
      const sortedParams = Object.keys(params)
        .sort()
        .map((k) => `${k}=${params[k]}`)
        .join('&');
      key += `?${sortedParams}`;
    }

    if (mockRouteHandlers[key]) {
      return mockRouteHandlers[key](body || {}, headers);
    }

    for (const [route, handler] of Object.entries(mockRouteHandlers)) {
      const routePath = route.split('?')[0];
      const routeParts = routePath.split('/');
      const keyParts = key.split('/');

      if (routeParts.length !== keyParts.length) continue;

      let match = true;
      const extractedParams = {};
      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          extractedParams[routeParts[i].slice(1)] = keyParts[i];
        } else if (routeParts[i] !== keyParts[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        return handler(extractedParams, body, headers);
      }
    }

    return {};
  }, []);

  const request = useCallback(async (path, method = 'GET', body = null, extraHeaders = {}) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return getMockResponse(path, method, {}, body, buildHeaders(extraHeaders));
    }

    const url = `${config.baseUrl}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const options = {
        method,
        headers: buildHeaders(extraHeaders),
        signal: controller.signal,
      };
      if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message =
          errorData?.error?.message ||
          errorData?.error ||
          errorData?.message ||
          `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(message);
      }

      const contentLength = response.headers.get('content-length');
      if (method === 'DELETE' && (response.status === 204 || contentLength === '0')) {
        return null;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }, [config.baseUrl, config.timeoutMs, buildHeaders, getMockResponse]);

  const get = useCallback(async (path, params = {}) => {
    if (USE_MOCK) {
      return getMockResponse(path, 'GET', params, null, buildHeaders());
    }

    const queryString = new URLSearchParams(params).toString();
    const fullPath = queryString ? `${path}?${queryString}` : path;
    return request(fullPath, 'GET');
  }, [buildHeaders, getMockResponse, request]);

  const getWithParams = useCallback(async (path, params = {}) => {
    return get(path, params);
  }, [get]);

  const post = useCallback(async (path, body, extraHeaders = {}) => {
    return request(path, 'POST', body, extraHeaders);
  }, [request]);

  const put = useCallback(async (path, body) => {
    return request(path, 'PUT', body);
  }, [request]);

  const del = useCallback(async (path) => {
    return request(path, 'DELETE');
  }, [request]);

  return useMemo(() => ({ get, getWithParams, post, put, del }), [get, getWithParams, post, put, del]);
}
