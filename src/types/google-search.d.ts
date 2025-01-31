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