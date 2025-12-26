document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskButton = document.getElementById("add-task-button");
  const taskList = document.getElementById("task-list");
  const progressFill = document.querySelector(".progress");
  const taskNumber = document.getElementById("task-number");
  const prioritySelect = document.getElementById("priority-select");

  const updateProgress = () => {
    const total = taskList.children.length;
    const completed = taskList.querySelectorAll(
      ".task-checkbox:checked"
    ).length;

    if (total === 0) {
      progressFill.style.width = "0%";
      taskNumber.textContent = "0 / 0";
    } else {
      const percent = (completed / total) * 100;
      progressFill.style.width = percent + "%";
      taskNumber.textContent = `${completed} / ${total}`;
    }
  };

  const sortTasks = () => {
    const tasks = Array.from(taskList.children);
    const taskCompleted = tasks.filter(
      (li) => li.querySelector(".task-checkbox").checked
    );
    const taskIncomplete = tasks.filter(
      (li) => !li.querySelector(".task-checkbox").checked
    );

    taskIncomplete.sort((a, b) => {
      const PrioretyA = a.dataset.priority || "low";
      const PrioretyB = b.dataset.priority || "low";
      const priorityOrder = { high: 0, mid: 1, low: 2 };
      return priorityOrder[PrioretyA] - priorityOrder[PrioretyB];
    });

    taskList.innerHTML = "";
    [...taskIncomplete, ...taskCompleted].forEach((li) =>
      taskList.appendChild(li)
    );
  };

  const bindTaskEvents = (li) => {
    const checkbox = li.querySelector(".task-checkbox");
    const editButton = li.querySelector(".edit-task-button");
    const deleteButton = li.querySelector(".delete-task-button");
    const taskSpan = li.querySelector(".task-text");

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        li.classList.add("completed");
        editButton.disabled = true;
        editButton.style.opacity = "0.5";
        editButton.style.cursor = "not-allowed";
        editButton.style.pointerEvents = "none";
      } else {
        li.classList.remove("completed");
        editButton.disabled = false;
        editButton.style.opacity = "1";
        editButton.style.cursor = "pointer";
        editButton.style.pointerEvents = "auto";
      }
      sortTasks();
      updateProgress();
      saveTaskToLocalStorage();
    });

    editButton.addEventListener("click", () => {
      if (checkbox.checked) return;
      const newText = prompt("Edit your task:", taskSpan.textContent);
      if (newText !== null && newText.trim() !== "") {
        taskSpan.textContent = newText.trim();
        saveTaskToLocalStorage();
      }
    });

    deleteButton.addEventListener("click", () => {
      li.remove();
      updateProgress();
      saveTaskToLocalStorage();
    });

    if (checkbox.checked) {
      li.classList.add("completed");
      editButton.disabled = true;
      editButton.style.opacity = "0.5";
      editButton.style.cursor = "not-allowed";
      editButton.style.pointerEvents = "none";
    }
  };

  /////

  const createTaskElement = (text, priority = "low", completed = false) => {
    const li = document.createElement("li");
    li.dataset.priority = priority;

    const priorityText =
      priority === "high" ? "High" : priority === "low" ? "Low" : "Mid";
    const priorityClass = `priority-${priority}`;

    li.innerHTML = `
    <div class="priority-tag ${priorityClass}">${priorityText}</div>
            <input type="checkbox" class="task-checkbox" ${
              completed ? "checked" : ""
            }>
      <span class="task-text">${text}</span>
      <button class="edit-task-button"><i class="fa-regular fa-pen-to-square"></i></button>
      <button class="delete-task-button"><i class="fa-solid fa-delete-left"></i></button>
    `;
    taskList.appendChild(li);
    bindTaskEvents(li);
    sortTasks();
    return li;
  };

  const saveTaskToLocalStorage = () => {
    const tasks = Array.from(taskList.querySelectorAll("li")).map((li) => {
      return {
        text: li.querySelector(".task-text").textContent.trim(),
        priority: li.dataset.priority || "low",
        completed: li.querySelector(".task-checkbox").checked,
      };
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const loadTasksFromLocalStorage = () => {
    const save = localStorage.getItem("tasks");
    if (!save) return;
    JSON.parse(save).forEach((task) => {
      createTaskElement(task.text, task.priority || "low", task.completed);
    });
    updateProgress();
  };

  const createTaskItem = (event) => {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const priority = prioritySelect.value;
    createTaskElement(taskText, priority);

    taskInput.value = "";
    updateProgress();
    saveTaskToLocalStorage();
  };

  updateProgress();
  loadTasksFromLocalStorage();

  addTaskButton.addEventListener("click", createTaskItem);
  taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      createTaskItem(event);
    }
  });
});

const liveTimeWithMillisecond = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formatted_hours = hours.toString().padStart(2, "0");
  const formatted_time = `${year}-${month}-${day} ${formatted_hours}:${minutes}:${seconds} ${ampm}`;

  document.getElementById("clock").textContent = formatted_time;
};

setInterval(liveTimeWithMillisecond, 1000);

document.getElementById("bg-upload").onchange = function (event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
  const base64Url = event.target.result;
    document.body.style.backgroundImage = `url(${base64Url})`;
    document.body.classList.add("custom-background");

    localStorage.setItem("customBackground", base64Url);
  
  }
  reader.readAsDataURL(file);
};


window.addEventListener("load", () => {
  const savedBackground = localStorage.getItem("customBackground");
  if (savedBackground) {
    document.body.style.backgroundImage = `url(${savedBackground})`;
    document.body.classList.add("custom-background");
  }
});

document.getElementById("reset-bg").addEventListener("click", () => {
  document.body.style.backgroundImage = "";
  document.body.classList.remove("custom-background");
  localStorage.removeItem("customBackground");
});