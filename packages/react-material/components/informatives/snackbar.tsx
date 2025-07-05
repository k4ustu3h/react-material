import React, { useEffect, useState, useCallback } from "react";
import "./snackbar.css";
import mergeProps from "../../utils/merge-props/merge-props";
import { Button } from "../buttons/button";
import { Portal } from "../misc/portal";

type CommonProps = {
  message: string;
  open?: boolean;
  autoHideDuration?: number;
  actionName?: string;
  onActionClick?: () => void;
  onClose?: () => void;
  closeable?: boolean;
  priority?: "low" | "medium" | "high";
};

type Props = CommonProps & React.HTMLAttributes<HTMLDivElement>;

// Internal component for rendering individual snackbars
export const Snackbar: React.FC<Props> = (props) => {
  const {
    message,
    open = false,
    autoHideDuration = 4000,
    actionName,
    onActionClick,
    onClose,
    closeable = false,
    className,
    priority = "medium",
    ...extraProps
  } = props;

  const [isVisible, setIsVisible] = useState(open);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimating(false);
      onClose?.();
    }, 150);
  }, [onClose]);

  const handleActionClick = useCallback(() => {
    onActionClick?.();
    handleClose();
  }, [onActionClick, handleClose]);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setIsAnimating(false);
    } else if (isVisible) {
      handleClose();
    }
  }, [open, isVisible]);

  useEffect(() => {
    if (isVisible && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideDuration]);

  if (!isVisible) {
    return null;
  }

  const baseClasses =
    `m3-snackbar-container ${isAnimating ? "hiding" : "showing"} ${className || ""}`.trim();

  // No Portal here - the context provider handles the portal and stacking
  return (
    <Portal>
      <div
        {...mergeProps(extraProps, {
          className: baseClasses,
          role: "alert",
          "aria-live": priority === "high" ? ("assertive" as const) : ("polite" as const),
          "aria-atomic": true,
          "aria-label": props["aria-label"] || `Notification: ${message}`,
        })}>
        <span className="m3-snackbar-message m3-font-body-medium">{message}</span>
        <div className="m3-snackbar-actions">
          {actionName && (
            <Button
              variant="text"
              className="m3-snackbar-action"
              size="extrasmall"
              onClick={handleActionClick}>
              {actionName}
            </Button>
          )}
          {closeable && (
            <Button
              variant="text"
              className="m3-snackbar-close"
              size="extrasmall"
              onClick={handleClose}
              aria-label="Close notification">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                aria-hidden="true">
                <path
                  fill="currentColor"
                  d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
                />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </Portal>
  );
};
