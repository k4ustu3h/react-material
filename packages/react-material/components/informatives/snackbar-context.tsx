import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Snackbar } from "./snackbar";

// Unique ID generator for snackbars
const generateId = () => Math.random().toString(36).substring(2, 11);

export type SnackbarOptions = {
  message: string;
  actionName?: string;
  onActionClick?: () => void;
  autoHideDuration?: number;
  closeable?: boolean;
};

// Extended options with an ID for tracking
type SnackbarItem = SnackbarOptions & {
  id: string;
  open: boolean;
};

type SnackbarContextType = {
  showSnackbar: (options: SnackbarOptions) => string;
  hideSnackbar: (id: string) => void;
  hideAllSnackbars: () => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

type SnackbarProviderProps = {
  children: ReactNode;
  maxSnackbars?: number;
};

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
  maxSnackbars = 3,
}) => {
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);

  const showSnackbar = useCallback(
    (options: SnackbarOptions): string => {
      const id = generateId();

      setSnackbars((prev) => {
        // Create new snackbar item
        const newSnackbar: SnackbarItem = {
          id,
          open: true,
          ...options,
        };

        // Add to existing stack, respecting maxSnackbars limit
        let updatedSnackbars = [...prev, newSnackbar];
        // if (updatedSnackbars.length > maxSnackbars) {
        //   // Remove oldest snackbar(s) if exceeding limit
        //   hideSnackbar(updatedSnackbars[0].id);
        //   setTimeout(() => {
        //     setSnackbars((prev) => prev.slice(prev.length - maxSnackbars));
        //   }, 200);
        // }
        return updatedSnackbars;
      });

      return id;
    },
    [maxSnackbars]
  );

  const hideSnackbar = useCallback((id: string) => {
    setSnackbars((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;

      // Mark snackbar as closed (will be removed after animation)
      const updated = [...prev];
      updated[index] = { ...updated[index], open: false };
      return updated;
    });

    // Remove from array after animation completes
    setTimeout(() => {
      setSnackbars((prev) => prev.filter((item) => item.id !== id));
    }, 50);
  }, []);

  const hideAllSnackbars = useCallback(() => {
    // Mark all as closed
    setSnackbars((prev) => prev.map((item) => ({ ...item, open: false })));

    // Remove all after animation completes
    setTimeout(() => {
      setSnackbars([]);
    }, 50);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar, hideAllSnackbars }}>
      {children}

      {snackbars.map((snackbar, i) => {
        // Calculate position from end (newest first)
        const reversedIndex = snackbars.length - 1 - i;
        return (
          <Snackbar
            key={snackbar.id}
            message={snackbar.message}
            open={snackbar.open}
            actionName={snackbar.actionName}
            onActionClick={snackbar.onActionClick}
            autoHideDuration={snackbar.autoHideDuration}
            closeable={snackbar.closeable}
            onClose={() => hideSnackbar(snackbar.id)}
            style={{
              zIndex: 100 - reversedIndex, // Higher index = newer = higher z-index
              bottom: `${16 + reversedIndex * 10}px`,
              scale: 1 - reversedIndex * 0.05, // Newest (reversedIndex=highest) is full size
              opacity: reversedIndex < maxSnackbars ? 1 : 0,
              backgroundColor: `rgb(var(--m3-scheme-inverse-surface) / ${1 - reversedIndex * 0.2})`, // Newest is more opaque
            }}
          />
        );
      })}
    </SnackbarContext.Provider>
  );
};
