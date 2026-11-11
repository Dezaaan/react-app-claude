/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for API requests. Defaults to "/api" (same origin). */
  readonly VITE_API_URL?: string;
  /** Set to "false" to disable mock API responses in development. */
  readonly VITE_API_MOCKS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
