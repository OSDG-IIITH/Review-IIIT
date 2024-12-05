import axios from 'axios';

const API_PREFIX = `${import.meta.env.VITE_BASE}api`;

const api = axios.create({
  baseURL: API_PREFIX,
  withCredentials: true,
  maxRedirects: 0,
});

function prefix_api(str) {
  return API_PREFIX + str;
}

export { api, prefix_api };
