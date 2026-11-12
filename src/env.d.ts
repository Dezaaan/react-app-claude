/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for API requests. Defaults to "/api/v1" (same origin). */
  readonly VITE_API_URL?: string;
  /** Dev server only: backend that /api is forwarded to. */
  readonly VITE_API_PROXY_TARGET?: string;
  /** Set to "false" to disable mock API responses in development. */
  readonly VITE_API_MOCKS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
