import React, { useEffect, useState } from "react";
import { Icon } from "react-material";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ className }) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadTocItems = async () => {
      // Wait for DOM to be ready
      await new Promise((resolve) => {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", resolve);
        } else {
          resolve(true);
        }
      });

      // Get all headings from the document (excluding h1) that have IDs for linking
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      const items: TocItem[] = Array.from(headings)
        .filter((heading) => {
          // Only include headings that have an ID (can be linked to)
          return heading.id && heading.id.trim() !== "";
        })
        .map((heading) => ({
          id: heading.id,
          title: heading.textContent || "",
          level: parseInt(heading.tagName.charAt(1)),
        }));

      setTocItems(items);
      setIsVisible(items.length > 0);
    };

    loadTocItems();
  }, []);

  useEffect(() => {
    const setupIntersectionObserver = async () => {
      if (tocItems.length === 0) return;

      // Wait a bit for DOM to settle
      await new Promise((resolve) => setTimeout(resolve, 100));

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const tocButton = document.querySelector(`[data-toc-id="${entry.target.id}"]`);
            if (tocButton) {
              if (entry.isIntersecting) {
                // Remove active class from all buttons
                document.querySelectorAll("[data-toc-id]").forEach((btn) => {
                  btn.classList.remove(
                    "bg-primary-container",
                    "text-on-primary-container",
                    "font-medium"
                  );
                  btn.classList.add("text-on-surface-variant");
                });

                // Add active class to current button
                tocButton.classList.remove("text-on-surface-variant");
                tocButton.classList.add("text-on-primary-container", "font-medium");
              }
            }
          });
        },
        {
          rootMargin: "20% 0px -80% 0px",
          threshold: 0,
        }
      );

      // Observe all heading elements
      const observeElements = async () => {
        for (const item of tocItems) {
          const element = document.getElementById(item.id);
          if (element) {
            observer.observe(element);
          }
          // Small delay to prevent blocking
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      };

      await observeElements();

      return () => observer.disconnect();
    };

    const cleanup = setupIntersectionObserver();
    return () => {
      cleanup.then((cleanupFn) => cleanupFn && cleanupFn());
    };
  }, [tocItems]);

  const handleItemClick = async (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Use smooth scrolling with promise-based approach
      await new Promise<void>((resolve) => {
        element.scrollIntoView({ behavior: "smooth" });
        // Wait for scroll to complete
        setTimeout(() => resolve(), 500);
      });
    }
    setIsOpen(false); // Close on mobile after selection
  };

  if (!isVisible || tocItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile toggle button */}
      {/* <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-20 bg-primary text-on-primary rounded-full p-3 shadow-lg hover:bg-primary-container hover:text-on-primary-container transition-colors"
        aria-label="Toggle table of contents">
        <Icon>{isOpen ? "close" : "list"}</Icon>
      </button> */}

      {/* Desktop floating panel */}
      <div className={`order-2 not-prose hidden lg:block sticky top-0 bottom-0 z-10 h-0 w-full`}>
        <div className="absolute right-0 bg-surface-container rounded-lg shadow-lg p-4 w-56 max-h-[calc(100vh-8rem)]">
          <div className="flex items-center mb-3 text-sm font-medium text-on-surface-variant">
            <Icon size={20} className="mr-2">list</Icon>
            On this page
          </div>
          <nav>
            <ul className="list-none">
              {tocItems.map((item) => (
                <li key={item.id} className="leading-0">
                  <button
                    onClick={() => handleItemClick(item.id)}
                    data-toc-id={item.id}
                    className="w-full text-left rounded text-xs py-2 px-1 transition-all duration-200 hover:bg-surface-bright text-on-surface-variant hover:text-on-surface"
                    style={{
                      paddingLeft: `${(item.level - 1) * 12 + 8}px`,
                    }}>
                    <span className="line-clamp-2">{item.title.replace("link", "")}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-15 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}>
          <div className="fixed bottom-0 left-0 right-0 bg-surface-container rounded-t-lg p-6 max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm font-medium text-on-surface-variant">
                <Icon size={20} className="mr-2">list</Icon>
                On this page
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-surface-bright transition-colors">
                <Icon size={20}>close</Icon>
              </button>
            </div>
            <nav>
              <ul className="space-y-1">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item.id)}
                      data-toc-id={item.id}
                      className="w-full text-left px-2 py-2 rounded text-sm transition-all duration-200 hover:bg-surface-bright text-on-surface-variant hover:text-on-surface"
                      style={{
                        paddingLeft: `${(item.level - 1) * 12 + 8}px`,
                      }}>
                      <span className="line-clamp-2">{item.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default TableOfContents;
