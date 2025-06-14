declare global {
  var hot_timeout: Timeout;

  namespace NodeJS {
    interface ProcessEnv {
      WEBUI_URL: string;
      MAX_DATA_VERSION: string;

      YUKIOTOKO_API_TOKEN: string;
    }
  }
}

export {};
