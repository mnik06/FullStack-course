import type { TEnv } from 'src/types/EnvSchema';

// Here we all env vars
declare global {
  namespace NodeJS {
    interface ProcessEnv extends TEnv {}
  }
}