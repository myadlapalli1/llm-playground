import { useEffect, useState } from "react"

import { ButtonParam } from "@/components/ui/paramButton"

function SideMenu({
  onParameters,
  onModels,
  onComparison,
  selectedModels = 0,
  darkMode,
  onThemeChange,
  forceCollapsed = false,
  isVisible = true,
  open,
  onOpenChange,
}) {
  // Sidebar is retracted by default
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = open !== undefined ? open : internalOpen

  const setMenuOpen = (nextOpen) => {
    if (open === undefined) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  useEffect(() => {
    if (!isVisible || forceCollapsed) {
      setMenuOpen(false)
    }
  }, [forceCollapsed, isVisible])

  const menuBackground = darkMode
    ? "rgba(24, 24, 27, 0.94)"
    : "rgba(255, 255, 255, 0.94)"

  const textColor = darkMode ? "#ffffff" : "#18181b"

  const borderColor = darkMode
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)"

  const hoverBackground = darkMode
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.08)"

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: "auto",
        margin: 0,
        transform: "none",

        width: isOpen ? "240px" : "64px",
        minWidth: isOpen ? "240px" : "64px",
        height: "100vh",

        display: "flex",
        flexDirection: "column",

        padding: isOpen ? "24px 16px" : "24px 8px",

        backgroundColor: menuBackground,
        borderRight: `1px solid ${borderColor}`,

        boxShadow: isOpen
          ? "12px 0 40px rgba(0, 0, 0, 0.25)"
          : "4px 0 20px rgba(0, 0, 0, 0.15)",

        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",

        overflow: "hidden",
        opacity: isVisible ? 1 : 0,

        transition:
          "width 0.35s ease, padding 0.35s ease, background-color 0.3s ease, opacity 0.25s ease",

        zIndex: 100,
      }}
    >
      {/* Retract button */}
      <button
        type="button"
        onClick={() => setMenuOpen(!isOpen)}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        style={{
          alignSelf: isOpen ? "flex-end" : "center",

          width: "42px",
          height: "42px",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          flexShrink: 0,

          border: `1px solid ${borderColor}`,
          borderRadius: "12px",

          backgroundColor: "transparent",
          color: textColor,

          fontSize: "25px",
          cursor: "pointer",

          transition:
            "background-color 0.2s ease, color 0.3s ease",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.backgroundColor = hoverBackground
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.backgroundColor = "transparent"
        }}
      >
        {isOpen ? "←" : "→"}
      </button>

      {/* Title */}
      <div
        style={{
          height: isOpen ? "70px" : "30px",

          display: "flex",
          alignItems: "center",

          opacity: isOpen ? 1 : 0,
          transform: isOpen
            ? "translateX(0)"
            : "translateX(-15px)",

          pointerEvents: isOpen ? "auto" : "none",

          transition:
            "opacity 0.25s ease, transform 0.3s ease, height 0.35s ease",
        }}
      >
        <h2
          style={{
            margin: 0,

            fontFamily: '"Cormorant Garamond", serif',
            fontSize: "30px",
            fontWeight: 700,

            color: textColor,
            whiteSpace: "nowrap",

            transition: "color 0.3s ease",
          }}
        >
          Controls
        </h2>
      </div>

      {/* Main menu buttons */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "12px",
          marginTop: "8px",
        }}
      >
        <MenuButton
          open={isOpen}
          icon="⚙"
          text="Parameters"
          darkMode={darkMode}
          onClick={onParameters}
        />

        <MenuButton
          open={isOpen}
          icon="◈"
          text="Models"
          darkMode={darkMode}
          number={selectedModels}
          onClick={onModels}
        />

        <MenuButton
          open={isOpen}
          icon="⇄"
          text="Comparison"
          darkMode={darkMode}
          onClick={onComparison}
        />
      </nav>

      {/* Light and dark mode button */}
      <div
        style={{
          marginTop: "auto",
          width: "100%",
        }}
      >
        <MenuButton
          open={isOpen}
          icon={darkMode ? "☀" : "☾"}
          text={darkMode ? "Light mode" : "Dark mode"}
          darkMode={darkMode}
          onClick={onThemeChange}
        />
      </div>
    </aside>
  )
}

function MenuButton({
  open,
  icon,
  text,
  number = 0,
  darkMode,
  onClick,
}) {
  return (
    <ButtonParam
      type="button"
      onClick={onClick}
      title={!open ? text : undefined}
      style={{
        width: "100%",
        minHeight: "48px",

        justifyContent: open ? "flex-start" : "center",

        paddingLeft: open ? "14px" : "0",
        paddingRight: open ? "14px" : "0",

        color: darkMode ? "#e4e4e7" : "#111827",
        textShadow: darkMode ? "none" : "0 0 10px rgba(17, 24, 39, 0.12)",

        overflow: "hidden",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.color = darkMode ? "#ffffff" : "#030712"
        event.currentTarget.style.textShadow = darkMode
          ? "0 0 12px rgba(255,255,255,0.35)"
          : "0 0 14px rgba(15, 23, 42, 0.28)"
        event.currentTarget.style.transform = "scale(1.03)"
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.color = darkMode ? "#e4e4e7" : "#111827"
        event.currentTarget.style.textShadow = darkMode ? "none" : "0 0 10px rgba(17, 24, 39, 0.12)"
        event.currentTarget.style.transform = "scale(1)"
      }}
    >
      <span
        style={{
          width: open ? "26px" : "100%",
          flexShrink: 0,

          fontSize: "22px",
          textAlign: "center",
        }}
      >
        {icon}
      </span>

      <span
        style={{
          maxWidth: open ? "150px" : "0",
          marginLeft: open ? "12px" : "0",

          opacity: open ? 1 : 0,

          overflow: "hidden",
          whiteSpace: "nowrap",

          transition:
            "max-width 0.35s ease, margin-left 0.35s ease, opacity 0.2s ease",
        }}
      >
        {text}
      </span>

      {number > 0 && open && (
        <span
          style={{
            minWidth: "25px",
            marginLeft: "auto",
            padding: "1px 7px",

            borderRadius: "999px",
            backgroundColor: darkMode
              ? "rgba(255, 255, 255, 0.14)"
              : "rgba(0, 0, 0, 0.1)",

            fontSize: "15px",
            textAlign: "center",
          }}
        >
          {number}
        </span>
      )}
    </ButtonParam>
  )
}

export { SideMenu }