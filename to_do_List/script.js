document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskButton = document.getElementById("add-task-button");
  const taskList = document.getElementById("task-list");
  const tasklistcontainer = document.querySelector(".tasklist-container");
  const toggleEmptyState = () => {
    tasklistcontainer.style.width = taskList;
    children.length > 0 ? "100%" : "60%";
  };

const progressFill = document.querySelector(".progress");
const taskNumber = document.getElementById("task-number");

const updateProgress = () => {
  const total = taskList.children.length;
  const completed = taskList.querySelectorAll(".task-checkbox:checked").length;

  if (total === 0) {
    progressFill.style.width = "0%";
    taskNumber.textContent = "0 / 0";
  } else {
    const percent = (completed / total) * 100;
    progressFill.style.width = percent + "%";
    taskNumber.textContent = `${completed} / ${total}`;
  }
};

  const createTaskItem = (event) => {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (!taskText) {
      return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <input type="checkbox" class="task-checkbox">
        <button class="edit-task-button">Edit</button>
        <button class="delete-task-button">Delete</button>
        `;

    const checkbox = li.querySelector(".task-checkbox");
    const editButton = li.querySelector(".edit-task-button");
    const deleteButton = li.querySelector(".delete-task-button");
    checkbox.addEventListener("change", () => {

      if (checkbox.checked) {
        li.classList.add("completed");
        editButton.disabled = true;
        editButton.style.cursor = "not-allowed";
        editButton.style.opacity = "0.5";
        editButton.style.pointerEvents = "none";
        taskList.appendChild(li);
      } else {
        li.classList.remove("completed");
        editButton.disabled = false;
        editButton.style.cursor = "pointer";
        editButton.style.opacity = "1";
        taskList.insertBefore(li, taskList.firstChild);
      }
      updateProgress();

      li.querySelector(".edit-task-button").addEventListener("click", () => {
        if (checkbox.checked) return;

        const taskSpan = li.querySelector(".task-text");
        const newTaskText = prompt("Edit your task:", taskSpan.textContent);
        if (!checkbox.checked) {
          taskSpan.textContent = newTaskText.trim();
        }
      
      });
    });
    deleteButton.addEventListener("click", () => {
      taskList.removeChild(li);
      updateProgress();
    });

    li.querySelector(".delete-task-button").addEventListener("click", () => {
      taskList.removeChild(li);
      toggleEmptyState();
      updateProgress();
    });

    taskList.appendChild(li);
    taskInput.value = "";
    updateProgress();
  };


updateProgress();

  addTaskButton.addEventListener("click", createTaskItem);
  taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      createTaskItem(event);
    }
  });
});
