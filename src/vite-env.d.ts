/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GITHUB_USERNAME: string;
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
