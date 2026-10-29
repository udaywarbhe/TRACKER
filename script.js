const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const pendingTaskList = document.querySelector("#pending-list");
const completedTaskList = document.querySelector("#completed-list");
const totalCount = document.querySelector("#total-count");
const pendingCount = document.querySelector("#pending-count");
const completedCount = document.querySelector("#completed-count");
const pendingEmptyState = document.querySelector("#pending-empty-state");
const completedEmptyState = document.querySelector("#completed-empty-state");
const statusMessage = document.querySelector("#status-message");

const STORAGE_KEY = "daymark.tasks.v1";

let nextTaskId = 1;

function readSavedTasks() {
  let serializedTasks;

  try {
    serializedTasks = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    statusMessage.textContent = "Saved tasks could not be accessed. Changes may not be saved.";
    return [];
  }

  if (serializedTasks === null) {
    return [];
  }

  try {
    const savedTasks = JSON.parse(serializedTasks);
    const isValidSnapshot =
      Array.isArray(savedTasks) &&
      savedTasks.every(
        (task) =>
          task &&
          typeof task.text === "string" &&
          task.text.trim().length > 0 &&
          task.text.length <= 160 &&
          typeof task.completed === "boolean",
      );

    if (!isValidSnapshot) {
      throw new Error("Invalid saved task data");
    }

    return savedTasks;
  } catch {
    statusMessage.textContent = "Saved tasks could not be read. Add a task to replace the invalid saved data.";
    return [];
  }
}

function saveTasks() {
  const taskSnapshot = [
    ...pendingTaskList.querySelectorAll(".task-item"),
    ...completedTaskList.querySelectorAll(".task-item"),
  ]
    .sort((left, right) => Number(left.dataset.taskOrder) - Number(right.dataset.taskOrder))
    .map((listItem) => ({
      text: listItem.querySelector(".task-text").textContent,
      completed: listItem.querySelector(".task-toggle").checked,
    }));

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(taskSnapshot));
    return true;
  } catch {
    return false;
  }
}

function reportTaskChange(message) {
  statusMessage.textContent = saveTasks()
    ? message
    : `${message} This change could not be saved in this browser.`;
}

function updateListSummary() {
  const pendingTotal = pendingTaskList.children.length;
  const completedTotal = completedTaskList.children.length;

  totalCount.textContent = pendingTotal + completedTotal;
  pendingCount.textContent = pendingTotal;
  completedCount.textContent = completedTotal;
  pendingEmptyState.hidden = pendingTotal > 0;
  completedEmptyState.hidden = completedTotal > 0;
}

function insertTaskInOrder(list, listItem) {
  const taskOrder = Number(listItem.dataset.taskOrder);
  const nextTask = Array.from(list.children).find(
    (item) => Number(item.dataset.taskOrder) > taskOrder,
  );

  list.insertBefore(listItem, nextTask || null);
}

function createTask(taskText, completed = false) {
  const taskId = nextTaskId;
  nextTaskId += 1;

  const listItem = document.createElement("li");
  listItem.className = "task-item";
  listItem.dataset.taskOrder = taskId;

  const checkbox = document.createElement("input");
  checkbox.className = "task-toggle";
  checkbox.type = "checkbox";
  checkbox.id = `task-${taskId}`;
  checkbox.checked = completed;
  checkbox.setAttribute(
    "aria-label",
    `Mark ${taskText} as ${completed ? "pending" : "complete"}`,
  );

  const label = document.createElement("label");
  label.className = "task-text";
  label.htmlFor = checkbox.id;
  label.textContent = taskText;

  listItem.classList.toggle("is-complete", completed);

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete ${taskText}`);

  checkbox.addEventListener("change", () => {
    const shouldRestoreFocus = document.activeElement === checkbox;
    listItem.classList.toggle("is-complete", checkbox.checked);
    checkbox.setAttribute(
      "aria-label",
      `Mark ${taskText} as ${checkbox.checked ? "pending" : "complete"}`,
    );
    insertTaskInOrder(
      checkbox.checked ? completedTaskList : pendingTaskList,
      listItem,
    );
    if (shouldRestoreFocus) {
      checkbox.focus();
    }
    updateListSummary();
    reportTaskChange(
      checkbox.checked ? `Completed: ${taskText}` : `Marked as pending: ${taskText}`,
    );
  });

  deleteButton.addEventListener("click", () => {
    listItem.remove();
    updateListSummary();
    reportTaskChange(`Deleted: ${taskText}`);
    taskInput.focus();
  });

  listItem.append(checkbox, label, deleteButton);
  insertTaskInOrder(completed ? completedTaskList : pendingTaskList, listItem);
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
  reportTaskChange(`Added: ${taskText}`);
});

readSavedTasks().forEach(({ text, completed }) => createTask(text, completed));
updateListSummary();