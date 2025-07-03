import React, { useState, useEffect, useRef } from "react";
import DottedBackground from "../misc/dotted-background";

const DocsPreview = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPreview = async () => {
      // Wait for DOM to be ready
      await new Promise((resolve) => {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", resolve);
        } else {
          resolve(true);
        }
      });

      // Set up intersection observer for lazy loading
      const observer = new IntersectionObserver(
        async (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !isVisible) {
              setIsVisible(true);

              // Add a small delay for smooth rendering
              await new Promise((resolve) => setTimeout(resolve, 100));
              setIsLoaded(true);

              observer.disconnect();
              break;
            }
          }
        },
        {
          rootMargin: "50px 0px",
          threshold: 0.1,
        }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    };

    const cleanup = loadPreview();
    return () => {
      cleanup.then((cleanupFn) => cleanupFn && cleanupFn());
    };
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-4 p-4 rounded-lg [&>pre]:m-0 border border-dashed border-primary-container my-8 relative transition-opacity duration-300 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
      {...props}>
      {isVisible && props.children}
    </div>
  );
};

export const DocsComp = (props: React.HTMLAttributes<HTMLPreElement>) => {
  return (
    <div className="flex gap-2 relative p-4 flex-wrap overflow-hidden rounded-md not-prose">
      <DottedBackground className="absolute inset-0 w-full h-full -z-10 opacity-30" />
      {props.children}
    </div>
  );
};

export default DocsPreview;
