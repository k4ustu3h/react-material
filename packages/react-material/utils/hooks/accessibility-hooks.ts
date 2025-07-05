import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for managing focus trapping within a component
 * Useful for modals, dialogs, and other overlay components
 */
export function useFocusTrap(isActive: boolean = false) {
  const containerRef = useRef<HTMLElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusableElement = focusableElements[0] as HTMLElement;
    const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Store the previously focused element
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    // Focus the first element
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          // Shift + Tab: focus previous element
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement?.focus();
            e.preventDefault();
          }
        } else {
          // Tab: focus next element
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus to the previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
}

/**
 * Custom hook for managing announcements to screen readers
 * Useful for dynamic content updates and status messages
 */
export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState<string>("");
  const [priority, setPriority] = useState<"polite" | "assertive">("polite");

  const announce = (message: string, level: "polite" | "assertive" = "polite") => {
    setAnnouncement("");
    setPriority(level);

    // Use setTimeout to ensure the announcement is made after clearing
    setTimeout(() => {
      setAnnouncement(message);
    }, 100);
  };

  return {
    announce,
    announcement,
    priority,
    // Helper function to get props for live region
    getLiveRegionProps: () => ({
      "aria-live": priority,
      "aria-atomic": true,
      style: {
        position: "absolute" as const,
        left: "-10000px",
        width: "1px",
        height: "1px",
        overflow: "hidden" as const,
      },
    }),
  };
}

/**
 * Custom hook for managing keyboard navigation in lists
 * Supports arrow keys, home, end, and optional type-ahead
 */
export function useKeyboardNavigation(
  itemCount: number,
  onSelectionChange?: (index: number) => void,
  enableTypeAhead: boolean = false
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typeAheadQuery, setTypeAheadQuery] = useState("");
  const typeAheadTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleKeyDown = (e: KeyboardEvent, itemLabels?: string[]) => {
    let newIndex = currentIndex;

    switch (e.key) {
      case "ArrowDown":
        newIndex = (currentIndex + 1) % itemCount;
        e.preventDefault();
        break;
      case "ArrowUp":
        newIndex = currentIndex === 0 ? itemCount - 1 : currentIndex - 1;
        e.preventDefault();
        break;
      case "Home":
        newIndex = 0;
        e.preventDefault();
        break;
      case "End":
        newIndex = itemCount - 1;
        e.preventDefault();
        break;
      default:
        // Type-ahead functionality
        if (enableTypeAhead && itemLabels && e.key.length === 1) {
          const query = typeAheadQuery + e.key.toLowerCase();
          setTypeAheadQuery(query);

          // Find matching item
          const matchingIndex = itemLabels.findIndex((label) =>
            label.toLowerCase().startsWith(query)
          );

          if (matchingIndex !== -1) {
            newIndex = matchingIndex;
          }

          // Clear type-ahead query after delay
          if (typeAheadTimeoutRef.current) {
            clearTimeout(typeAheadTimeoutRef.current);
          }
          typeAheadTimeoutRef.current = setTimeout(() => {
            setTypeAheadQuery("");
          }, 1000);
        }
        return;
    }

    setCurrentIndex(newIndex);
    onSelectionChange?.(newIndex);
  };

  return {
    currentIndex,
    setCurrentIndex,
    handleKeyDown,
  };
}

/**
 * Custom hook for managing component IDs for accessibility
 * Ensures unique IDs are generated for form controls and their labels
 */
export function useAccessibleIds(baseId?: string) {
  const [ids] = useState(() => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const prefix = baseId || `component-${timestamp}-${random}`;

    return {
      main: prefix,
      label: `${prefix}-label`,
      description: `${prefix}-description`,
      error: `${prefix}-error`,
      helper: `${prefix}-helper`,
    };
  });

  return ids;
}

/**
 * Custom hook for managing reduced motion preferences
 * Helps components respect user's motion preferences
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Custom hook for managing escape key handling
 * Useful for closing modals, menus, and other overlay components
 */
export function useEscapeKey(callback: () => void, isActive: boolean = true) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [callback, isActive]);
}

/**
 * Custom hook for managing click outside behavior
 * Useful for closing dropdowns, menus, and other overlay components
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  isActive: boolean = true
) {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback, isActive]);
}

/**
 * Custom hook for managing roving tabindex
 * Useful for keyboard navigation in toolbars, grids, and other composite widgets
 */
export function useRovingTabIndex(itemCount: number, initialIndex: number = 0) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const getTabIndex = (index: number) => {
    return index === currentIndex ? 0 : -1;
  };

  const moveFocus = (direction: "next" | "previous" | "first" | "last") => {
    let newIndex;
    switch (direction) {
      case "next":
        newIndex = (currentIndex + 1) % itemCount;
        break;
      case "previous":
        newIndex = currentIndex === 0 ? itemCount - 1 : currentIndex - 1;
        break;
      case "first":
        newIndex = 0;
        break;
      case "last":
        newIndex = itemCount - 1;
        break;
      default:
        return;
    }
    setCurrentIndex(newIndex);
  };

  return {
    currentIndex,
    setCurrentIndex,
    getTabIndex,
    moveFocus,
  };
}
