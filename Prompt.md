# AI Collaboration Log: Kanban Board Logic & Architecture

This document log proves the usage of AI for understanding deep logical constraints, component tree hierarchies, state management lifecycles, and syntax architecture during the development of the Kanban Board project.

---

### Prompt 1: Event-Driven Drag Activation Constraints
* **Purpose:** Understanding pointer sensors and preventing click-collision.
* **Objective:** To learn why mouse clicks inside a draggable element block input events and how to establish physical boundaries for drag activation.
* **Prompt:** 
  > "In `@dnd-kit/core`, when I attach `useDraggable` to a card component, it immediately hijacks all pointer down events, which breaks underlying button clicks and input elements. Explain the exact logic behind `PointerSensor` configurations and how `activationConstraint` with a pixel `distance` works mathematically to separate a 'click' from an intentional 'drag' event."
* **Response Type:** Explanation of event propagation, event cascading inhibition, and the 2D pixel delta tracking system before activating state changes.

---

### Prompt 2: Lexical Scope and Bracket Closure in Multi-Component Architecture
* **Purpose:** Debugging syntax trees in nested JSX configurations.
* **Objective:** To structurally map how unclosed function expressions or wrongly placed object literals up the component tree break lexical scopes down the line.
* **Prompt:** 
  > "I am experiencing a syntax break where a hook declaration (`useSensors`) inside my main component is throwing a parsing error on its closing symbols `);`. Given that the hook's syntax itself is accurate, walk me through the diagnostic logic of how an unclosed ternary operator block or a deformed array-mapping expression in an upstream component (`DroppableColumn`) corrupts the Abstract Syntax Tree (AST) downstream."
* **Response Type:** Code block tracking, AST compilation logic, and parent-child block closure mapping.

---

### Prompt 3: Dynamic State Transformation during Component Loops
* **Purpose:** Ensuring data flow integrity within iterated child arrays.
* **Objective:** Tracking variable assignments inside `.map()` arrays to make sure text variables don't conflict with unique identifiers.
* **Prompt:** 
  > "When mapping over an array of task objects to render child cards dynamically, what is the best practice for passing state-modifier functions down the pipeline? Specifically, explain why passing an identity tracker (`editingId`) into a property field designated for string content (`editingText`) breaks reactive tracking during live updates."
* **Response Type:** React reconciliation breakdown, property-drilling data type validation rules.

---

### Prompt 4: Local Storage Hydration Logic in Functional State
* **Purpose:** Understanding lazy initialization of stateful structures.
* **Objective:** To learn how to read browser storage during initial component mounting without causing redundant re-renders.
* **Prompt:** 
  > "Explain the operational difference between initializing `useState` directly with `localStorage.getItem()` versus passing a wrapper arrow function to fetch data lazily. How does React handle state hydration during the initial paint under both approaches?"
* **Response Type:** Lifecycle explanation, evaluation frequency of state parameters, and functional state performance analysis.

---

### Prompt 5: State Normalization for Kanban Column Filtering
* **Purpose:** Designing optimized computational derivations of raw states.
* **Objective:** Learning why keeping three separate arrays for status columns is an anti-pattern compared to filtering a single source of truth.
* **Prompt:** 
  > "In a board system containing columns like 'To Do', 'In Progress', and 'Done', explain why it is memory-efficient to store all tasks in a single global state array and compute filtered states dynamically on every render cycle, rather than mutating separate dedicated state channels for each stage."
* **Response Type:** Single-source-of-truth principles, shallow equality comparisons, and computed property patterns.

---

### Prompt 6: CSS Transform Layer Isolation in Draggable Systems
* **Purpose:** Understanding stacking contexts and UI anomalies.
* **Objective:** Analyzing layout issues caused by `translate3d` positioning during component operations.
* **Prompt:** 
  > "When using `translate3d(${transform.x}px, ${transform.y}px, 0)` dynamically, explain how browsers establish a new stacking context. Why do dragging cards occasionally slide underneath neighboring containers unless forced by explicit `zIndex` changes during the active drag state?"
* **Response Type:** CSS Stacking Context mechanics, hardware acceleration basics, and element overlay hierarchy rules.

---

### Prompt 7: Conditional Element Swapping Logic for Inline Inputs
* **Purpose:** Mastering inline UX conditional state transitions.
* **Objective:** Evaluating focus retention logic when changing elements from layout text to interactive input text boxes.
* **Prompt:** 
  > "Walk me through the ideal event handling chain for an inline edit workflow on a task card. When transitioning an element from a raw structural paragraph tag `<p>` to an active `<input>` field based on state conditions, how should `autoFocus`, `onBlur`, and `onKeyDown` be structured to guarantee continuous keyboard navigation?"
* **Response Type:** Component refocusing sequences, blur handler behavior, and keyboard event mappings.

---

### Prompt 8: Reactivity Constraints in Combined Drag-Drop Event Cycles
* **Purpose:** Designing continuous multi-step drag updates.
* **Objective:** Tracking the sequence of array changes required when changing an item's status via drop zones.
* **Prompt:** 
  > "Analyze the data mapping sequence inside a drop-completion function (`handleDragEnd`). When an element is moved from one functional area (`active`) over to another (`over`), what is the step-by-step array tracking process needed to locate the correct reference ID and alter its properties safely without mutating state directly?"
* **Response Type:** Functional array mutation protections (`.map()`), shallow copying patterns (`...task`), and state updater logic.

---

### Prompt 9: Props Destructuring vs Direct Namespace Access
* **Purpose:** Code readability and variable naming standard conventions.
* **Objective:** Evaluating how HTML-style property attributes break structural naming rules in modern development frameworks.
* **Prompt:** 
  > "Explain why passing properties with inconsistent naming structures (e.g., using hyphens like `header-text` instead of camelCase format like `headerText`) disrupts component property destructuring patterns. How do modern build engines convert these parameters into structural JavaScript engine nodes?"
* **Response Type:** Parameter parsing rules, token analysis conventions, and component cleaner architecture.

---

### Prompt 10: Side-Effect Syncing via Array Dependency Arrays
* **Purpose:** Managing asynchronous local persistence.
* **Objective:** Understanding the safety controls of side effects to ensure application states do not cause continuous write loops.
* **Prompt:** 
  > "When running a side-effect controller (`useEffect`) to push state changes out to a browser's storage engine, what are the tracking guidelines for adding parameter elements into the synchronization array? What prevents a synchronization cycle from causing an infinite update cascade?"
* **Response Type:** Side effect cycle mapping, dependency array validations, and prevention of infinite rendering triggers.