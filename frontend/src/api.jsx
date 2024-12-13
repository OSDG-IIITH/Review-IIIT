import axios from 'axios';

import { HOST_SUBPATH } from './constants';

const API_PREFIX = `${HOST_SUBPATH}api`;

const api = axios.create({
  baseURL: API_PREFIX,
  withCredentials: true,
  maxRedirects: 0,
});

function prefix_api(str) {
  return API_PREFIX + str;
}

let logoutCallback = null;

const set_logout_callback = (callback) => {
  logoutCallback = callback;
};

function do_login() {
  window.location.href = prefix_api('/login');
}

function do_logout() {
  // explicitly call the logout callback to update frontend state consistently.
  // This fixes the bug where using the browser back button can leave frontend
  // and backend out of sync on the logout status
  if (logoutCallback) {
    logoutCallback();
  }
  window.location.href = prefix_api('/logout');
}

export { api, do_login, do_logout, set_logout_callback };
