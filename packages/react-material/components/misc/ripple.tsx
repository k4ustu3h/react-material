import React, { useRef } from "react";
import "./ripple.css";
import { useIsomorphicLayoutEffect } from "../../utils/hooks/use-isomorphic-layout-effect";

interface RippleContainerProps {
  // You can add props here if needed for customization
}

export const Ripple: React.FC<RippleContainerProps> = () => {
  const rippleContainerRef = useRef<HTMLDivElement>(null);
  const cancelRipples = useRef<(() => void)[]>([]);

  useIsomorphicLayoutEffect(() => {
    // Skip server-side execution
    if (typeof window === "undefined") return;

    const node = rippleContainerRef.current;
    if (!node) return;

    // The 'broken' class is removed on mount, similar to Svelte's use:action
    node.classList.remove("broken");

    const parent = node.parentElement!;

    const ripple = (e: MouseEvent) => {
      if (e.button !== 0) return;

      // Check for disabled states similar to Svelte
      if (parent instanceof HTMLButtonElement) {
        if (parent.disabled) return;
      }
      if (parent instanceof HTMLLabelElement) {
        const control = parent.control;
        if (control instanceof HTMLInputElement && control.disabled) return;
      }
      if (parent.classList.contains("layer-container")) {
        const input = parent.previousElementSibling;
        if (input instanceof HTMLInputElement && input.disabled) return;
      }

      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y)) * 2.5;
      const speed = Math.max(Math.min(Math.log(size) * 50, 600), 200);

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.style.cssText = `
        position: absolute;
        left: ${x - size / 2}px;
        top: ${y - size / 2}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
        overflow: visible;
      `;

      const gradientId = `ripple-${Date.now()}`;
      const gradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
      gradient.id = gradientId;

      const stops = [
        { offset: "0%", opacity: "0.12" },
        { offset: "70%", opacity: "0.12" },
        { offset: "100%", opacity: "0" },
      ];

      stops.forEach(({ offset, opacity }) => {
        const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop.setAttribute("offset", offset);
        stop.setAttribute("stop-color", "currentColor");
        stop.setAttribute("stop-opacity", opacity);
        gradient.appendChild(stop);
      });

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", `${size / 2}`);
      circle.setAttribute("cy", `${size / 2}`);
      circle.setAttribute("r", "0");
      circle.setAttribute("fill", `url(#${gradientId})`);

      const expand = document.createElementNS("http://www.w3.org/2000/svg", "animate");
      expand.setAttribute("attributeName", "r");
      expand.setAttribute("from", "0");
      expand.setAttribute("to", `${size / 2}`);
      expand.setAttribute("dur", `${speed}ms`);
      expand.setAttribute("fill", "freeze");
      expand.setAttribute("calcMode", "spline");
      expand.setAttribute("keySplines", "0.4 0, 0.2 1");

      circle.appendChild(expand);
      svg.appendChild(gradient);
      svg.appendChild(circle);

      // Browser detection - skip on server
      if (typeof window !== "undefined" && typeof navigator !== "undefined") {
        const ua = navigator.userAgent;
        const isFirefox = ua.includes("Firefox");
        const isTrulySafari = !ua.includes("Chrome") && ua.includes("Safari");
        if (!isFirefox && !isTrulySafari && size > 100) {
          const filterId = `noise-${Date.now()}`;
          const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
          filter.id = filterId;

          const turb = document.createElementNS("http://www.w3.org/2000/svg", "feTurbulence");
          turb.setAttribute("type", "fractalNoise");
          turb.setAttribute("baseFrequency", "0.6");
          turb.setAttribute("seed", Math.random().toString());

          const blur = document.createElementNS("http://www.w3.org/2000/svg", "feDisplacementMap");
          blur.setAttribute("in", "SourceGraphic");
          blur.setAttribute("in2", "turbulence");
          blur.setAttribute("scale", `${size ** 2 * 0.0002}`);
          blur.setAttribute("xChannelSelector", "R");
          blur.setAttribute("yChannelSelector", "B");

          filter.appendChild(turb);
          filter.appendChild(blur);

          circle.setAttribute("filter", `url(#${filterId})`);
          svg.appendChild(filter);
        }

        node.appendChild(svg);

        cancelRipples.current.push(() => {
          const fade = document.createElementNS("http://www.w3.org/2000/svg", "animate");
          fade.setAttribute("attributeName", "opacity");
          fade.setAttribute("from", "1");
          fade.setAttribute("to", "0");
          fade.setAttribute("dur", "800ms");
          fade.setAttribute("fill", "freeze");
          fade.setAttribute("calcMode", "spline");
          fade.setAttribute("keySplines", "0.4 0, 0.2 1");
          circle.appendChild(fade);
          (fade as any).beginElement(); // beginElement is not directly on SVGAnimateElement in TS
          setTimeout(() => svg.remove(), 800);
        });
      }

      parent.addEventListener("pointerdown", ripple);

      const handlePointerUpOrDragEnd = () => {
        cancelRipples.current.forEach((cancel) => cancel());
        cancelRipples.current = [];
      };

      if (typeof window !== "undefined") {
        window.addEventListener("pointerup", handlePointerUpOrDragEnd);
        window.addEventListener("dragend", handlePointerUpOrDragEnd);
      }

      return () => {
        parent.removeEventListener("pointerdown", ripple);
        if (typeof window !== "undefined") {
          window.removeEventListener("pointerup", handlePointerUpOrDragEnd);
          window.removeEventListener("dragend", handlePointerUpOrDragEnd);
        }
      };
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return (
    <>
      <div className={`m3-ripple-container broken`} ref={rippleContainerRef}></div>
      <div className="tint"></div>
    </>
  );
};
