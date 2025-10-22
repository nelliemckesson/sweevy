"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TextPopupProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  className?: string;
  contentClassName?: string;
  delayDuration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TextPopup({
  children,
  content,
  side = "top",
  align = "center",
  className,
  contentClassName,
  delayDuration = 200,
  open: controlledOpen,
  onOpenChange,
}: TextPopupProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const [actualSide, setActualSide] = React.useState(side);
  const [actualAlign, setActualAlign] = React.useState(align);

  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (open: boolean) => {
      if (!isControlled) {
        setInternalOpen(open);
      }
      onOpenChange?.(open);
    },
    [isControlled, onOpenChange]
  );

  const calculatePosition = React.useCallback(() => {
    if (!triggerRef.current || !popupRef.current || !isOpen) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spacing = 8; // Gap between trigger and popup

    let finalSide = side;
    let finalAlign = align;
    let top = 0;
    let left = 0;

    // Calculate if there's enough space on each side
    const spaceAbove = triggerRect.top;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceLeft = triggerRect.left;
    const spaceRight = viewportWidth - triggerRect.right;

    // Determine best side
    if (side === "top" || side === "bottom") {
      // Check vertical space
      if (side === "top" && spaceAbove < popupRect.height + spacing) {
        if (spaceBelow > spaceAbove) {
          finalSide = "bottom";
        }
      } else if (side === "bottom" && spaceBelow < popupRect.height + spacing) {
        if (spaceAbove > spaceBelow) {
          finalSide = "top";
        }
      }

      // Position vertically
      if (finalSide === "top") {
        top = triggerRect.top - popupRect.height - spacing;
      } else {
        top = triggerRect.bottom + spacing;
      }

      // Position horizontally based on alignment
      if (align === "start") {
        left = triggerRect.left;
      } else if (align === "end") {
        left = triggerRect.right - popupRect.width;
      } else {
        left = triggerRect.left + triggerRect.width / 2 - popupRect.width / 2;
      }

      // Adjust horizontal position if overflowing
      if (left < spacing) {
        left = spacing;
        finalAlign = "start";
      } else if (left + popupRect.width > viewportWidth - spacing) {
        left = viewportWidth - popupRect.width - spacing;
        finalAlign = "end";
      }
    } else {
      // side === "left" || side === "right"
      // Check horizontal space
      if (side === "left" && spaceLeft < popupRect.width + spacing) {
        if (spaceRight > spaceLeft) {
          finalSide = "right";
        }
      } else if (side === "right" && spaceRight < popupRect.width + spacing) {
        if (spaceLeft > spaceRight) {
          finalSide = "left";
        }
      }

      // Position horizontally
      if (finalSide === "left") {
        left = triggerRect.left - popupRect.width - spacing;
      } else {
        left = triggerRect.right + spacing;
      }

      // Position vertically based on alignment
      if (align === "start") {
        top = triggerRect.top;
      } else if (align === "end") {
        top = triggerRect.bottom - popupRect.height;
      } else {
        top = triggerRect.top + triggerRect.height / 2 - popupRect.height / 2;
      }

      // Adjust vertical position if overflowing
      if (top < spacing) {
        top = spacing;
        finalAlign = "start";
      } else if (top + popupRect.height > viewportHeight - spacing) {
        top = viewportHeight - popupRect.height - spacing;
        finalAlign = "end";
      }
    }

    setPosition({ top, left });
    setActualSide(finalSide);
    setActualAlign(finalAlign);
  }, [isOpen, side, align]);

  React.useEffect(() => {
    if (isOpen) {
      calculatePosition();
      window.addEventListener("resize", calculatePosition);
      window.addEventListener("scroll", calculatePosition, true);

      return () => {
        window.removeEventListener("resize", calculatePosition);
        window.removeEventListener("scroll", calculatePosition, true);
      };
    }
  }, [isOpen, calculatePosition]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, delayDuration);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpen(false);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        className={cn("inline-block", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {isOpen && (
        <div
          ref={popupRef}
          className={cn(
            "fixed z-50 rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md",
            "animate-in fade-in-0 zoom-in-95",
            actualSide === "top" && "slide-in-from-bottom-2",
            actualSide === "bottom" && "slide-in-from-top-2",
            actualSide === "left" && "slide-in-from-right-2",
            actualSide === "right" && "slide-in-from-left-2",
            contentClassName
          )}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {content}
        </div>
      )}
    </>
  );
}

TextPopup.displayName = "TextPopup";
