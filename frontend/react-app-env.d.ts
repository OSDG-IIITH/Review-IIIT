interface ImportMetaEnv {
  readonly VITE_SUBPATH: string;
  readonly VITE_MSG_MAX_LEN: string;
  readonly VITE_DEV_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
