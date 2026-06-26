/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly CONTENTFUL_SPACE_ID?: string;
  readonly CONTENTFUL_DELIVERY_TOKEN?: string;
  readonly CONTENTFUL_ENVIRONMENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
