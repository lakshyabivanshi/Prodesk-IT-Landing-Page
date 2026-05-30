# Phase 1: UI/UX Architecture & Technical Logic

**Objective:** Using AI as a logical collaborator to define design systems, responsive layouts, and debug interaction rules before coding.

---

## 1. UI Color System
*   **60-30-10 Rule:** 60% Background (White/Light Gray), 30% Structure/Text (Slate/Charcoal), and 10% Accent (Tech Blue) for CTAs.
*   **Core Tech Blue (Top Priority):** `#2A55E5` (Chosen for high-energy modern SaaS branding and strong visual presence).
*   **Secondary Deep Blue:** `#0A2540` (For high-contrast text and corporate trust).

---

## 2. Hamburger Menu Debugging Logic
If the menu fails to open, the technical inspection covers three layers:
1.  **State Management:** JavaScript click events failing to bind or toggle the active class due to script execution order.
2.  **CSS Specificity:** Hardcoded `display: none` or `opacity: 0` overriding the active utility class.
3.  **Z-Index Conflict:** The menu opens but renders hidden behind the Hero layout layer.

---

## 3. Responsive Hero Section Rules
To prevent layout breaking across screens, the architecture ensures:
*   **No Fixed Heights:** Replacing fixed pixels (e.g., `800px`) with relative units like `min-height: 100vh` or `80svh`.
*   **Flex/Grid Fluidity:** Using `flex-wrap: wrap` or CSS Grid auto-fit so text and media blocks stack naturally on mobile.
*   **Fluid Typography:** Implementing `clamp()` for headings to scale down smoothly without text overflows.

---

## 4. Card Wrap & Containment Logic
To stop cards from breaking or leaking out of the screen boundary during wrap: