# Prompts.md — AI-Assisted Learning Log

This document tracks the key questions I asked an AI assistant while building this project, along with the underlying concept I was trying to understand. The goal of using AI here was not to generate the codebase, but to debug issues I ran into, validate my own implementation, and understand *why* certain things were failing — so I could fix them myself and retain the concept.

---

### 1. Debugging a PDF upload failure (initial symptom)
**What I asked:** Why does my form work fine with just text fields, but throws an "undefined function" / "could not connect to API server" error specifically when a PDF is uploaded?
**What I learned:** The error pointed to how the file was being handled between frontend and backend — specifically around how `FormData` needs to be sent (no manual `Content-Type` header) versus JSON, and how the backend needs middleware (`multer`) to even receive a file.

### 2. Understanding Vite's actual role
**What I asked:** A teammate uses Vite — does Vite help solve a backend PDF parsing bug?
**What I learned:** Vite is purely a frontend dev server/bundler. It has no relationship to backend (Node/Express) logic. This helped me correctly separate "frontend tooling" from "backend logic" in my mental model of the stack.

### 3. Sending a PDF to Gemini 2.5 directly
**What I asked:** How does Gemini 2.5 actually accept a PDF — do I need a separate text-extraction library?
**What I learned:** Gemini's `generateContent` endpoint accepts a PDF directly as `inline_data` (base64-encoded), so the model reads the document natively instead of me pre-extracting text with a separate library. This changed how I structured my `parts` array in the request payload.

### 4. Diagnosing why PDF-only requests crashed
**What I asked:** Why does my cover letter generate fine without a PDF, but fail every time *with* a PDF, even though the code looked correct?
**What I learned:** I had declared `userPrompt` with `const`, then tried to reassign it inside the `if (req.file)` block using `+=`. Since `const` cannot be reassigned, this threw `TypeError: Assignment to constant variable`, but only when the PDF branch executed — explaining why the bug was invisible in the no-PDF path. Fixed by switching to `let`.

### 5. Intermittent failure on first run only
**What I asked:** Why does my app throw a Gemini rejection error the first time I run it, but succeed on a second attempt with identical input?
**What I learned:** This wasn't a code bug — the terminal logs showed a `503 UNAVAILABLE` ("model experiencing high demand") from Gemini's side. Learned the difference between a client-side bug and a transient upstream API failure, and implemented retry-with-backoff logic to handle it gracefully instead of failing immediately.

### 6. Why the deployed site fails only on mobile
**What I asked:** My app works locally, but after deploying the frontend to Netlify, it fails on my phone with "could not connect to the API server" — why?
**What I learned:** `localhost` always refers to the device making the request, not a remote server. My backend was only running on my own laptop, so any other device (like my phone) had no server to reach at `localhost:5000`. This clarified that frontend and backend need to be deployed *separately* — frontend on Netlify, backend on a Node-compatible host (Render).

### 7. How frontend and backend deployment actually connect
**What I asked:** If I deploy my backend, it gets a new URL from the host — so do I need to keep updating `server.js` every time, and does pushing to GitHub mean my code "lives" only on GitHub?
**What I learned:** GitHub is just version-controlled storage — pushing doesn't "run" the code anywhere. Render/Netlify pull from GitHub and actually execute/serve it. Once deployed, only the *frontend's* fetch URL needs to point to the new backend URL — the backend itself doesn't need to know its own deployed address.

### 8. Mapping the assignment rubric against my actual implementation
**What I asked:** Does my current code satisfy the Phase 3 "Dynamic Personalization" and "markdown → clean HTML" requirements?
**What I learned:** My implementation sent the PDF directly via `inline_data` rather than using a separate extraction library like `pdf-parse` — functionally similar but technically a different approach than the rubric described. Also identified that I was rendering raw markdown as plain text instead of parsing it into HTML, which I fixed using the `marked` library so headings/bold/paragraphs render properly instead of one unformatted block.

### 9. Git branching for sprint submission
**What I asked:** How do I create a separate `sprint-4` branch containing all my files, instead of pushing everything to `main`?
**What I learned:** `git checkout -b <branch-name>` creates and switches to a new branch; commits and pushes from that point only affect that branch, keeping `main` (or earlier sprint history) untouched.

---

**Note:** All code in this repository was written and debugged by me. AI assistance was used in a Socratic/explain-first capacity — to help me understand *why* something failed (e.g., `const` reassignment, MIME type mismatches, `localhost` scoping) so I could apply the fix myself and explain it in review if asked.