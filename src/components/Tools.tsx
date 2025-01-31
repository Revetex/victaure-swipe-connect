import { useEffect, useRef } from "react";

export function Tools() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Ensure the iframe loads your project's index.html
    if (iframeRef.current) {
      const script = document.createElement('script');
      script.src = "https://cdn.gpteng.co/gptengineer.js";
      script.type = "module";
      iframeRef.current.contentDocument?.head.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full h-full min-h-[calc(100vh-8rem)]">
      <iframe
        ref={iframeRef}
        src="https://lovable.dev/projects/57f45340-669a-4f20-abfa-730168322fa5/preview"
        className="w-full h-full min-h-[calc(100vh-8rem)] border-none"
        title="Projet intégré"
        allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi"
      />
    </div>
  );
}