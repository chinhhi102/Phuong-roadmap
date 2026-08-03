/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 'server' routes persistence to the local data server; anything else uses localStorage. */
  readonly VITE_STORAGE?: string
  /** Base URL of the local data server (default http://localhost:8787). */
  readonly VITE_SERVER_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
