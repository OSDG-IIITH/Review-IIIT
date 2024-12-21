const VITE_SUBPATH = import.meta.env.VITE_SUBPATH
  ? `${import.meta.env.VITE_SUBPATH}/`
  : '/';
const VITE_MSG_MAX_LEN = import.meta.env.VITE_MSG_MAX_LEN;

export { VITE_SUBPATH, VITE_MSG_MAX_LEN };
