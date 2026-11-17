import { useApiConfig } from '../context/ApiConfigContext';

export function buildAuthService(baseUrl) {
  async function request(path, method = 'POST', body = null) {
    const url = `${baseUrl}${path}`;
    const options = {
      method,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        data?.error?.message || data?.error || data?.message || `HTTP ${response.status}`
      );
    }
    return data;
  }

  return {
    async login(email, password) {
      return request('/auth/login', 'POST', { email, password });
    },
    async register({ nombre, apellido, email, password, rol }) {
      return request('/auth/register', 'POST', { nombre, apellido, email, password, rol });
    },
    async logout() {
      return request('/auth/logout', 'POST');
    },
  };
}

export function useAuthService() {
  const config = useApiConfig();
  return buildAuthService(config.baseUrl);
}
