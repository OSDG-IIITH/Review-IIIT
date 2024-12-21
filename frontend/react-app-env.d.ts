interface ImportMetaEnv {
  readonly VITE_SUBPATH: string;
  readonly VITE_MSG_MAX_LEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
