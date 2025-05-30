"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useTheme } from "../contexts/ThemeContext"

interface TooltipProps {
  children: React.ReactNode
  content?: string
  title?: string
  description?: string
  image?: string
  position?: "right" | "left" | "top" | "bottom" | "auto"
  offset?: number
  delay?: number
  disabled?: boolean
  className?: string
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  title,
  description,
  image,
  position = "right",
  offset = 8,
  delay = 400,
  disabled = false,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [actualPosition, setActualPosition] = useState(position)
  const { isDarkMode } = useTheme()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const isMouseOverRef = useRef(false)
  const shouldSuppressShowRef = useRef(false)

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current || position !== "auto") {
      setActualPosition(position)
      return
    }

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    if (triggerRect.right + tooltipRect.width + offset <= viewport.width) {
      setActualPosition("right")
    }
    else if (triggerRect.left - tooltipRect.width - offset >= 0) {
      setActualPosition("left")
    }
    else if (triggerRect.top - tooltipRect.height - offset >= 0) {
      setActualPosition("top")
    }
    else {
      setActualPosition("bottom")
    }
  }

  const clearTooltipTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const hideTooltip = useCallback(() => {
    clearTooltipTimeout()
    setIsVisible(false)
    isMouseOverRef.current = false
  }, [clearTooltipTimeout])

  const showTooltip = useCallback(() => {
    if (disabled) return
    if (shouldSuppressShowRef.current) {
        return;
    }
    
    clearTooltipTimeout()
    isMouseOverRef.current = true
    
    timeoutRef.current = setTimeout(() => {
      if (isMouseOverRef.current) {
        setIsVisible(true)
        setTimeout(calculatePosition, 0)
      }
    }, delay)
  }, [disabled, delay, clearTooltipTimeout])

  const handleMouseEnter = useCallback(() => {
    showTooltip()
  }, [showTooltip])

  const handleMouseLeave = useCallback(() => {
    hideTooltip()
  }, [hideTooltip])

  const handleMouseDown = useCallback(() => {
    hideTooltip()
    shouldSuppressShowRef.current = true;
    setTimeout(() => {
        shouldSuppressShowRef.current = false;
    }, 100);
  }, [hideTooltip])

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (!isVisible || !triggerRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const buffer = 10

    const isMouseNearTrigger = (
      e.clientX >= triggerRect.left - buffer &&
      e.clientX <= triggerRect.right + buffer &&
      e.clientY >= triggerRect.top - buffer &&
      e.clientY <= triggerRect.bottom + buffer
    )

    if (!isMouseNearTrigger) {
      hideTooltip()
    }
  }, [isVisible, hideTooltip])

  const handleGlobalClick = useCallback((e: MouseEvent) => {
    if (!triggerRef.current || !isVisible) return

    const isClickInside = triggerRef.current.contains(e.target as Node)
    if (!isClickInside) {
      hideTooltip()
    }
  }, [isVisible, hideTooltip])

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('click', handleGlobalClick)
      document.addEventListener('scroll', hideTooltip)
      window.addEventListener('blur', hideTooltip)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('click', handleGlobalClick)
      document.removeEventListener('scroll', hideTooltip)
      window.removeEventListener('blur', hideTooltip)
    }
  }, [isVisible, handleGlobalMouseMove, handleGlobalClick, hideTooltip])

  useEffect(() => {
    return () => {
      clearTooltipTimeout()
    }
  }, [clearTooltipTimeout])

  const getTooltipStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      zIndex: 1000,
      pointerEvents: "none",
      opacity: isVisible ? 1 : 0,
      transition: "opacity 0.2s ease-in-out",
      backgroundColor: isDarkMode ? "#1f2937" : "#374151",
      color: "white",
      padding: image ? "0 0 8px 0" : "6px 8px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "500",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      width: "240px",
      wordWrap: "break-word",
      overflow: "hidden",
    }

    switch (actualPosition) {
      case "right":
        return {
          ...baseStyle,
          left: "100%",
          top: "0%",
          marginLeft: `${offset}px`,
        }
      case "left":
        return {
          ...baseStyle,
          right: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          marginRight: `${offset}px`,
        }
      case "top":
        return {
          ...baseStyle,
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginBottom: `${offset}px`,
        }
      case "bottom":
        return {
          ...baseStyle,
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: `${offset}px`,
        }
      default:
        return baseStyle
    }
  }

  return (
    <div
      ref={triggerRef}
      className={`tooltip-trigger ${className}`}
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div ref={tooltipRef} className="tooltip-content" style={getTooltipStyle()}>
          {image && (
            <div
              style={{
                width: "100%",
                borderRadius: "6px 6px 0 0",
                overflow: "hidden",
              }}
            >
              <img
                src={image || "/placeholder.svg"}
                alt=""
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          )}
          {title && (
            <div
              style={{
                fontSize: "15px",
                textAlign: "left",
                fontWeight: "600",
                padding: "8px 8px 4px 8px",
                lineHeight: "1.2",
              }}
            >
              {title}
            </div>
          )}
          {(content || description) && (
            <div
              style={{
                textAlign: "left",
                lineHeight: "1.2",
                padding: "0 8px 8px 8px",
                fontSize: "12px",
                opacity: 0.9,
              }}
            >
              {content || description}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Tooltip
