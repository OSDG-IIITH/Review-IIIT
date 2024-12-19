import axios from 'axios';

import { HOST_SUBPATH } from './constants';
import { ErrorMessageCallback, LogoutCallback } from './types';

const API_PREFIX = `${HOST_SUBPATH}api`;

const api = axios.create({ baseURL: API_PREFIX });

/* Error handling API */
let errMsgCallback: ErrorMessageCallback | null = null;
const set_errmsg_callback = (callback: ErrorMessageCallback) => {
  errMsgCallback = callback;
};
const set_errmsg = (msg: string | null) => {
  if (errMsgCallback) {
    errMsgCallback(msg);
  }
};
const clear_errmsg = () => {
  set_errmsg(null);
};

/* Intercept all API errors, convert them to human readable format and handle it */
api.interceptors.response.use(
  (response) => response, // Pass successful responses as-is
  (error) => {
    let err_msg = 'Unknown error';
    if (error.response) {
      const detail =
        error.response.data?.detail || error.response.data?.message;
      let more_info = 'Not specified';
      if (Array.isArray(detail)) {
        more_info = detail
          .map((item) => item.msg || JSON.stringify(item))
          .join(', ');
      } else if (typeof detail === 'string' && detail) {
        more_info = detail;
      }

      err_msg = `Backend returned an error: [code ${error.response.status}] ${more_info}`;
    } else if (error.request) {
      err_msg =
        'Backend must be down or under maintenance, it did not respond.';
    } else {
      err_msg = `Could not setup backend request: ${error.message}`;
    }

    set_errmsg(err_msg);
    return Promise.reject({ message: err_msg });
  }
);

function prefix_api(str: string) {
  return API_PREFIX + str;
}

/* Login/logout API wrappers */
let logoutCallback: LogoutCallback | null = null;

const set_logout_callback = (callback: LogoutCallback) => {
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

export {
  api,
  do_login,
  do_logout,
  set_logout_callback,
  set_errmsg_callback,
  clear_errmsg,
};
