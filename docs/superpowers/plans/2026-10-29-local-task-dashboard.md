# Local Task Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reshape Daymark into a clean dashboard with task totals and separate pending/completed lists, without changing its local-only feature set.

**Architecture:** Keep the existing plain HTML, CSS, and JavaScript. Add dashboard and list regions to the page, then update the existing task code to render tasks into the appropriate section and refresh counts while preserving the current local-storage key and snapshot format.

**Tech Stack:** HTML, CSS, vanilla JavaScript; integrated browser for UI checks.

**Spec:** [2026-10-29-local-task-dashboard-design.md](../specs/2026-10-29-local-task-dashboard-design.md)

## Global Constraints

- The app is plain HTML, CSS, and JavaScript.
- Existing tasks use the `daymark.tasks.v1` local-storage key and contain text and completion state.
- Preserve that format and its existing empty/error states.
- No login, logout, user identity, or remote synchronization.
- No task editing, dates, or other new task behavior.
- Avoid replacing Daymark's branding or adding dependencies.

## Review Focus

- No saved tasks: show zero totals and clear empty states in both sections.
- One pending task: show it only in Pending and update total/pending counts.
- All tasks completed: show them only in Completed and update counts correctly.
- Corrupt saved data: retain the existing accessible error message and do not crash while rendering.
- Local storage unavailable: keep the current warning behavior when reading or saving tasks fails.

---

### Task 1: Build the local task dashboard

**Files:**
- Modify: `index.html` — add summary cards and pending/completed task sections.
- Modify: `script.js` — render tasks into the sections and keep counts/current storage behavior in sync.
- Modify: `styles.css` — style the dashboard and preserve responsive and reduced-motion behavior.

**Interfaces:**
- Consumes: Existing form IDs `task-form`, `task-input`, and live status region `status-message`; existing `readSavedTasks()` and `saveTasks()` behavior.
- Produces: Summary values `total-count`, `pending-count`, and `completed-count`; list regions `pending-list` and `completed-list`; empty-state regions `pending-empty-state` and `completed-empty-state`.

- [ ] **Step 1: Verify the current page fails the dashboard behavior checks**

Open the page and check that the required summary values and grouped list regions are not yet present. Record the baseline; do not change app code in this step.

- [ ] **Step 2: Add semantic dashboard markup in `index.html`**

Add three labeled summary values with IDs `total-count`, `pending-count`, and `completed-count`. Add separate Pending and Completed headings, lists with IDs `pending-list` and `completed-list`, and empty states with IDs `pending-empty-state` and `completed-empty-state`. Keep the existing form and live status region.

- [ ] **Step 3: Update `script.js` to render and summarize both sections**

Use the existing saved snapshot shape (`{ text, completed }`) and `daymark.tasks.v1` key. Render each task in exactly one list according to its completion state; update all three counts and the matching empty state after add, toggle, delete, initial load, and failed/invalid storage reads. Preserve accessible checkbox/delete labels and the current storage error messages.

- [ ] **Step 4: Style the dashboard in `styles.css`**

Use a light, spacious card layout inspired by the screenshot while retaining the Daymark palette. Make the three summary cards fit desktop widths and stack cleanly on narrow screens; keep visible focus states and reduced-motion support.

- [ ] **Step 5: Run functional checks in the integrated browser**

Verify each Review Focus case: zero tasks; one pending task; completing/unchecking a task moves it between sections and updates counts; deleting a task updates its section and counts; reload preserves the existing snapshot and renders both groups; malformed or unavailable storage shows the existing warning without a runtime error. Check a narrow viewport for overflow and keyboard focus visibility.

- [ ] **Step 6: Run the JavaScript syntax check**

Run: `node --check script.js`
Expected: exits successfully with no syntax errors.
