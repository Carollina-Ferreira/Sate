const backendUrl =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000';

export const API_ORIGIN = backendUrl
  .trim()
  .replace(/\/+$/, '')
  .replace(/\/api$/i, '');

export const API_BASE = `${API_ORIGIN}/api`;