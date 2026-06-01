"use client";

import React, { useEffect } from "react";

export default function RightClickGuard(): React.ReactNode {
  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };
    
    document.addEventListener("contextmenu", handleContextMenu);
    
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return null;
}
