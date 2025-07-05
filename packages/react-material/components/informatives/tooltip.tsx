import React, { useState, useRef, useId, useEffect } from "react";
import "./tooltip.css";
import mergeProps from "../../utils/merge-props/merge-props";
import { Portal } from "../misc/portal";
import { Button } from "../buttons/button";

type CommonProps = {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  variant?: "plain" | "rich";
  delay?: number;
  disabled?: boolean;
  children: React.ReactNode;
  // Rich variant props
  header?: string;
  content?: string;
  // Multiple actions support
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "text" | "outlined" | "filled";
  }>;
};

type Props = CommonProps & React.HTMLAttributes<HTMLDivElement>;

export const Tooltip: React.FC<Props> = (props) => {
  const {
    text,
    position = "top",
    variant = "plain",
    delay = 200,
    disabled = false,
    children,
    header,
    actions,
    ...extraProps
  } = props;

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  const showTooltip = () => {
    if (disabled || !text) return;

    setIsHovered(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(
      () => {
        setIsVisible(false);
        // For rich tooltips, delay hiding to allow interaction
        setTimeout(
          () => {
            setIsHovered(false);
          },
          variant === "rich" ? 100 : 200
        );
      },
      variant === "rich" ? 100 : 0
    );
  };

  const handleTooltipMouseEnter = () => {
    if (variant === "rich") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(true);
    }
  };

  const handleTooltipMouseLeave = () => {
    if (variant === "rich") {
      hideTooltip();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      hideTooltip();
    }
  };

  const getTooltipPosition = () => {
    if (!triggerRef.current) return {};

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const positions = {
      top: {
        bottom: `${window.innerHeight - triggerRect.top + 8}px`,
        left: `${triggerRect.left + triggerRect.width / 2}px`,
        transform: "translateX(-50%)",
      },
      bottom: {
        top: `${triggerRect.bottom + 8}px`,
        left: `${triggerRect.left + triggerRect.width / 2}px`,
        transform: "translateX(-50%)",
      },
      left: {
        top: `${triggerRect.top + triggerRect.height / 2}px`,
        right: `${window.innerWidth - triggerRect.left + 8}px`,
        transform: "translateY(-50%)",
      },
      right: {
        top: `${triggerRect.top + triggerRect.height / 2}px`,
        left: `${triggerRect.right + 8}px`,
        transform: "translateY(-50%)",
      },
    };

    return positions[position];
  };

  const triggerClasses = `m3-tooltip-trigger`;
  const tooltipClasses = `m3-tooltip-container ${variant} ${position} ${isVisible ? "tooltip-visible" : "tooltip-hidden"}`;

  return (
    <>
      <div
        ref={triggerRef}
        {...mergeProps(extraProps, {
          className: triggerClasses,
          onMouseEnter: showTooltip,
          onMouseLeave: hideTooltip,
          onFocus: showTooltip,
          onBlur: hideTooltip,
          onKeyDown: handleKeyDown,
          "aria-describedby": isVisible ? tooltipId : undefined,
        })}>
        {children}
      </div>

      {isHovered && (
        <Portal>
          <div
            id={tooltipId}
            className={tooltipClasses}
            style={getTooltipPosition()}
            role="tooltip"
            aria-hidden={!isVisible}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}>
            {variant === "rich" ? (
              <div className="m3-tooltip-rich-content">
                {header && (
                  <div className="m3-tooltip-header">
                    <p className="m3-font-body-medium">{header}</p>
                  </div>
                )}
                <div className="m3-tooltip-body">
                  <p className="m3-font-body-medium">{text}</p>
                </div>
                {actions && actions.length > 0 && (
                  <div className="m3-tooltip-action">
                    {actions.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant || "text"}
                        onClick={action.onClick}>
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <span className="m3-font-body-small">{text}</span>
            )}
          </div>
        </Portal>
      )}
    </>
  );
};
