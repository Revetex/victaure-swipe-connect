interface Window {
  google?: {
    search: {
      cse: {
        element: {
          render: (config: {
            div: HTMLElement | null;
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
  ___gcfg?: {
    parsetags?: string;
    suppressAnalytics?: boolean;
    suppressLogging?: boolean;
  };
}