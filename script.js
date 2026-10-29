const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const taskCount = document.querySelector("#task-count");
const statusMessage = document.querySelector("#status-message");

let nextTaskId = 1;

function updateListSummary() {
  const taskTotal = taskList.children.length;
  const completedTotal = taskList.querySelectorAll(".task-toggle:checked").length;

  emptyState.hidden = taskTotal > 0;
  taskCount.textContent = `${taskTotal} ${taskTotal === 1 ? "task" : "tasks"}`;

  if (taskTotal > 0) {
    taskCount.textContent += ` · ${completedTotal} done`;
  }
}

function createTask(taskText) {
  const taskId = nextTaskId;
  nextTaskId += 1;

  const listItem = document.createElement("li");
  listItem.className = "task-item";

  const checkbox = document.createElement("input");
  checkbox.className = "task-toggle";
  checkbox.type = "checkbox";
  checkbox.id = `task-${taskId}`;
  checkbox.setAttribute("aria-label", `Mark ${taskText} as complete`);

  const label = document.createElement("label");
  label.className = "task-text";
  label.htmlFor = checkbox.id;
  label.textContent = taskText;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete ${taskText}`);

  checkbox.addEventListener("change", () => {
    listItem.classList.toggle("is-complete", checkbox.checked);
    checkbox.setAttribute(
      "aria-label",
      `Mark ${taskText} as ${checkbox.checked ? "pending" : "complete"}`,
    );
    statusMessage.textContent = checkbox.checked
      ? `Completed: ${taskText}`
      : `Marked as pending: ${taskText}`;
    updateListSummary();
  });

  deleteButton.addEventListener("click", () => {
    listItem.remove();
    statusMessage.textContent = `Deleted: ${taskText}`;
    updateListSummary();
    taskInput.focus();
  });

  listItem.append(checkbox, label, deleteButton);
  taskList.append(listItem);
  updateListSummary();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskText = taskInput.value.trim();
  if (!taskText) {
    taskInput.setCustomValidity("Please enter a task before adding it.");
    taskInput.reportValidity();
    taskInput.addEventListener("input", () => taskInput.setCustomValidity(""), { once: true });
    return;
  }

  createTask(taskText);
  taskInput.value = "";
  taskInput.focus();
  statusMessage.textContent = `Added: ${taskText}`;
});

updateListSummary();