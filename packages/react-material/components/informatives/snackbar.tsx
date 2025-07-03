import React, { useEffect, useState, useCallback } from "react";
import "./snackbar.css";
import mergeProps from "../../utils/merge-props/merge-props";
import { Button } from "../buttons/button";
import { Icon } from "../misc/icon";
import { Portal } from "../misc/portal";

type CommonProps = {
  message: string;
  open?: boolean;
  autoHideDuration?: number;
  actionName?: string;
  onActionClick?: () => void;
  onClose?: () => void;
  closeable?: boolean;
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
      <div {...mergeProps(extraProps, { className: baseClasses })}>
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
              aria-label="Close">
              <Icon>close</Icon>
            </Button>
          )}
        </div>
      </div>
    </Portal>
  );
};

// Re-export from context for easier imports
export { useSnackbar, SnackbarProvider, type SnackbarOptions } from "./snackbar-context";
