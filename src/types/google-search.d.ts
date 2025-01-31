interface Window {
  ___gcfg?: {
    parsetags?: string;
    suppressAnalytics?: boolean;
    suppressLogging?: boolean;
  };
  google?: {
    search?: {
      cse?: {
        element?: {
          render: (config: {
            div: HTMLElement;
            tag: string;
            gname: string;
            attributes?: {
              enableLogging?: string;
              enableAnalytics?: string;
              enableHistory?: string;
              enableOrderBy?: string;
              noResultsString?: string;
              newWindow?: string;
              queryParameterName?: string;
              overlayResults?: string;
              resultsUrl?: string;
              linkTarget?: string;
            };
          }) => void;
        };
      };
    };
  };
}