# Local Task Dashboard Design

## Intent

Make Daymark's task page easier to scan by using the reference image's airy dashboard layout, while keeping the existing browser-only task tracker and its current behavior.

## Goals

- Show total, pending, and completed task counts in summary cards.
- Separate pending and completed tasks into clearly labeled sections.
- Keep adding tasks, checking them complete or pending, deleting them, and saving them in the existing local storage format.
- Keep the page responsive and accessible.

## Non-goals and anti-goals

- No login, logout, user identity, or remote synchronization.
- No task editing, dates, or other new task behavior.
- Do not imply that local tasks are tied to an account or backed up.
- Avoid replacing Daymark's branding or adding dependencies.

## Constraints

The app is plain HTML, CSS, and JavaScript. Existing tasks use the `daymark.tasks.v1` local-storage key and contain text and completion state. Preserve that format and its existing empty/error states.

## Approaches

- **Screenshot-faithful dashboard:** Add edit and date features alongside the new layout. This would require expanding stored task data and behavior.
- **Lighter dashboard (selected):** Add the summary cards and grouped lists while retaining current task actions and storage. This better fits the request to improve the UI without expanding the app's feature set.

## Design calls

Keep the Daymark name and existing palette, using a cleaner, light dashboard arrangement inspired by the screenshot. Keep the existing add-task form, checkbox completion, delete action, and local persistence.
