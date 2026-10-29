# Task persistence design

## Intent

Keep a person's tasks and completion states when they refresh or reopen Daymark, using browser `localStorage`.

## Goals and boundaries

- Restore task text and completion state on page load.
- Persist additions, completion changes, and deletions.
- Preserve the current layout, task interactions, counts, and accessible status announcements.
- Do not add a backend, dependencies, or unrelated task features.

## Approaches

1. **Save and restore a JSON snapshot (selected):** Keep the current DOM-based implementation. Read saved task records at startup, rebuild the list, and save a snapshot after each task mutation. This is the smallest change and fits the existing code.
2. **Introduce a task data model:** Store tasks in a JavaScript array and render the list from it. This makes state more explicit but requires a larger refactor for this improvement.

The snapshot approach is selected to minimize risk and keep existing behavior intact.

## Proposed implementation

- Store an array of `{ text, completed }` records under a Daymark-specific, versioned key in `localStorage`.
- On startup, parse and validate the saved records, rebuild tasks through the existing task-creation flow, and restore each completion state.
- Save the current task snapshot after adding, checking/unchecking, or deleting a task.
- Keep the page usable if stored data cannot be read or written; report persistence failures through the existing live status region rather than silently indicating success.
- Make no visual or interaction changes beyond those necessary to communicate a storage failure.

## Constraints and anti-goals

- `localStorage` is per browser and origin; this does not synchronize tasks between devices or browser profiles.
- Do not change the existing design, add features, or introduce a testing framework solely for this change.

## Verification plan

The repository currently has no test runner or test files, so verify in a browser:

1. With no saved entry, confirm the empty state and zero count are unchanged.
2. Add multiple tasks, refresh, then close and reopen the page; confirm all task text and order remain.
3. Complete and uncomplete tasks, refresh, and confirm the states and completed count remain accurate.
4. Delete a task, refresh, and confirm it stays deleted.
5. Confirm adding, toggling, and deleting still update the count and accessible status announcements.
6. If practical, test malformed saved data and unavailable storage; confirm the page remains usable and reports the persistence problem.
