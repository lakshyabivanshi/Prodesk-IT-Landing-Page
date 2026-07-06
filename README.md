# React Expense Tracker (ENG-58218)

A professional-grade Expense Tracker application designed to digitize manual workflows. Built with React fundamentals, this tool ensures operational efficiency, data integrity, and a seamless user experience for staff.

## 🚀 Key Features & Implementation
- **Core Functionality:** Full CRUD (Create, Read, Delete) operations with real-time state management.
- **Data Persistence:** Integrated `localStorage` to ensure data remains intact across sessions.
- **Edge Case Handling:**
  - **Empty States:** Graceful handling of empty lists with user-friendly "No Data Found" messaging.
  - **Connectivity Simulation:** Implemented asynchronous loading states to simulate high-latency (3G) connections.
  - **Robust Validation:** Strict input validation with visual feedback (red border highlighting) and inline error messaging for malformed/missing data.
- **Security & Safety:**
  - **XSS Prevention:** Sanitized inputs via `trim()` and `maxLength` constraints to ensure data integrity.
  - **Telemetry:** Automated console logging (`[Analytics]`) for auditing user interactions.
- **Accessibility (a11y):** Fully compliant with semantic HTML standards, featuring proper `aria-label` attributes for screen readers.
- **Design:** Monochromatic corporate-standard UI built with Tailwind CSS for consistent professional aesthetics.

## 🛠 Tech Stack
- **Library:** React (Functional components, `useState`, `useEffect`)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS

## 📋 Project Structure
- `src/components/ExpenseTracker.jsx`: Main logic, state handling, and UI rendering.
- `localStorage`: Used for persistent data storage.
- `Validation Logic`: Ensures that empty or malicious text entries are blocked before state updates.

## 💻 How to Run
1. Clone this repository.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

---
*Developed as part of the Core Infrastructure Overhaul (Ticket: ENG-58218).*