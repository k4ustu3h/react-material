import React, { useEffect, useState } from "react";
import { Button, Icon, Portal } from "react-material";

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
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
  const [primaryActiveId, setPrimaryActiveId] = useState<string | null>(null);
  const [userScrolling, setUserScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

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

  // Handle manual scrolling detection
  useEffect(() => {
    const handleTocScroll = () => {
      setUserScrolling(true);

      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set new timeout to reset userScrolling after scroll stops
      const newTimeout = setTimeout(() => {
        setUserScrolling(false);
      }, 1000); // Wait 1 second after scroll stops

      setScrollTimeout(newTimeout);
    };

    const tocContainer = document.querySelector(".toc-container");
    if (tocContainer) {
      tocContainer.addEventListener("scroll", handleTocScroll);

      return () => {
        tocContainer.removeEventListener("scroll", handleTocScroll);
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
      };
    }
  }, [scrollTimeout]);

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
                // Add active class to current button
                tocButton.classList.remove("text-on-surface-variant");
                tocButton.classList.add("!text-on-primary-container", "font-medium");

                // Update active IDs set
                setActiveIds((prev) => new Set([...prev, entry.target.id]));

                // Set as primary active if none set
                setPrimaryActiveId((prev) => prev || entry.target.id);
              } else {
                // Remove active class when no longer intersecting
                tocButton.classList.remove("!text-on-primary-container", "font-medium");
                tocButton.classList.add("text-on-surface-variant");

                // Remove from active IDs set and update primary if needed
                setActiveIds((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(entry.target.id);

                  // If this was the primary active item, update it
                  setPrimaryActiveId((currentPrimary) => {
                    if (currentPrimary === entry.target.id) {
                      return newSet.size > 0 ? Array.from(newSet)[0] : null;
                    }
                    return currentPrimary;
                  });

                  return newSet;
                });
              }
            }
          });
        },
        {
          rootMargin: "-10% 0px -10% 0px",
          threshold: 0.1,
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

  // Auto-scroll TOC to keep active item visible
  useEffect(() => {
    // Don't auto-scroll if user is manually scrolling
    if (userScrolling || activeIds.size === 0) return;

    // Find the topmost active item based on document order
    const sortedActiveIds = Array.from(activeIds).sort((a, b) => {
      const elementA = document.getElementById(a);
      const elementB = document.getElementById(b);
      if (!elementA || !elementB) return 0;
      return elementA.compareDocumentPosition(elementB) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

    const topActiveId = sortedActiveIds[0];
    const activeButton = document.querySelector(`[data-toc-id="${topActiveId}"]`);
    const tocContainer = document.querySelector(".toc-container") as HTMLElement;

    if (activeButton && tocContainer) {
      const containerRect = tocContainer.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      // Calculate if button is outside visible area
      const isAboveVisible = buttonRect.top < containerRect.top;
      const isBelowVisible = buttonRect.bottom > containerRect.bottom;

      if (isAboveVisible || isBelowVisible) {
        // Scroll to center the active item smoothly using CSS smooth scrolling
        const buttonOffsetTop = (activeButton as HTMLElement).offsetTop;
        const containerHeight = tocContainer.clientHeight;
        const scrollTo = buttonOffsetTop - containerHeight / 2;

        // Use CSS smooth scrolling for better performance
        tocContainer.style.scrollBehavior = "smooth";
        tocContainer.scrollTop = scrollTo;

        // Reset scroll behavior after animation
        setTimeout(() => {
          tocContainer.style.scrollBehavior = "auto";
        }, 500);
      }
    }
  }, [activeIds, userScrolling]);

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
      <Portal>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="tonal"
          size="small"
          className="xl:hidden fixed bottom-6 right-6 z-20 p-3 shadow-lg"
          aria-label="Toggle table of contents">
          <Icon>{isOpen ? "close" : "list"}</Icon>
        </Button>
      </Portal>

      {/* Desktop panel */}
      <div
        className={`order-2 not-prose hidden xl:flex sticky top-0 bottom-0 z-10 w-full items-end flex-col`}>
        <div className="flex items-center mb-3 text-sm font-medium text-on-surface-variant w-59 mt-4 p-4 pb-0">
          <Icon size={20} className="mr-2">
            list
          </Icon>
          On this page
        </div>
        <div className="right-0 rounded-lg w-60 max-h-[40vh] overflow-y-auto toc-container hide-scrollbar p-4 pt-0">
          <nav>
            <ul className="list-none">
              {tocItems.map((item) => (
                <li key={item.id} className="leading-0">
                  <Button
                    onClick={() => handleItemClick(item.id)}
                    data-toc-id={item.id}
                    variant="text"
                    size="extrasmall"
                    className="w-full justify-start text-wrap rounded-sm text-on-surface-variant"
                    style={{
                      paddingLeft: `${(item.level - 1) * 12 + 8}px`,
                      color: `rgb(var(--m3-scheme-on-surface-variant)/ ${1 - (item.level - 1) * 0.15})`,
                    }}>
                    <span className="line-clamp-2 text-wrap w-full text-left">
                      {item.title.replace("link", "")}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <Portal>
          <div
            className="xl:hidden fixed inset-0 z-15 bg-surface/50"
            onClick={() => setIsOpen(false)}>
            <div className="fixed bottom-0 left-0 right-0 md:w-[80%] mx-auto bg-surface-container rounded-t-lg shadow-lg max-h-80 overflow-hidden">
              <div className="flex items-center justify-between mb-3 text-sm font-medium text-on-surface-variant p-4 pb-0">
                <div className="flex items-center">
                  <Icon size={20} className="mr-2">
                    list
                  </Icon>
                  On this page
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="text"
                  size="small"
                  className="rounded-full p-1 min-w-0 w-8 h-8">
                  <Icon size={20}>close</Icon>
                </Button>
              </div>
              <div className="max-h-[calc(20rem-4rem)] overflow-y-auto toc-container hide-scrollbar p-4 pt-0">
                <nav>
                  <ul className="list-none">
                    {tocItems.map((item) => (
                      <li key={item.id} className="leading-0">
                        <Button
                          onClick={() => handleItemClick(item.id)}
                          data-toc-id={item.id}
                          variant="text"
                          className="w-full justify-start text-wrap rounded-sm text-on-surface-variant"
                          style={{
                            paddingLeft: `${(item.level - 1) * 12 + 20}px`,
                          }}>
                          <span className="line-clamp-2 text-wrap w-full text-left">
                            {item.title.replace("link", "")}
                          </span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default TableOfContents;
