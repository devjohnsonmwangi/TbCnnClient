/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_PORT?: string;
  readonly VITE_API_TIMEOUT?: string;
  readonly VITE_ENV?: string;
  readonly VITE_ENABLE_TB_DETECTION?: string;
  readonly VITE_DEBUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
