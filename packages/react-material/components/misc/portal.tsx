import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  container?: Element | null;
}

export const Portal: React.FC<PortalProps> = ({ children, container }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  const portalContainer = container || document.body;

  return createPortal(children, portalContainer);
};
