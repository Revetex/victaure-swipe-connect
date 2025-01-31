interface Window {
  google: {
    search: {
      cse: {
        element: {
          render: (config: {
            div: HTMLDivElement | null;
            tag: string;
            gname: string;
          }) => void;
        };
      };
    };
  };
}