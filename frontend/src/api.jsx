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

function do_login() {
  window.location.href = prefix_api('/login');
}

function do_logout() {
  window.location.href = prefix_api('/logout');
}

export { api, do_login, do_logout };
