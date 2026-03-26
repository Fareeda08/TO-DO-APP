const taskFieldContainer = document.querySelector(".task-field_container");
const taskField = taskFieldContainer.querySelector("input");

const taskContainer = document.querySelector(".task-container");
const taskElementsContainer = document.querySelector(".tasks");
const taskStatus = document.querySelector(".task-status");
const activeTaskNoEl = document.querySelector(".active-task-no span");

const mode = document.querySelector(".mode");
const body = document.querySelector("body");

let index = 1;
const allTaskArr = [];

mode.addEventListener("click", function () {
  const desktopMode = body.classList[0];

  if (body.classList[0] === "light-mode") {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
  } else {
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");
  }

  mode.setAttribute(
    "src",
    `./images/icon-${desktopMode === "light-mode" ? "moon" : "sun"}.svg`,
  );
});

taskFieldContainer.addEventListener("submit", function (ev) {
  ev.preventDefault();
  const inputTask = taskField.value;

  if (inputTask === "" || !isNaN(+inputTask)) {
    alert("Please enter a valid input");
    taskField.value = "";
    return;
  }

  renderTask(inputTask);
  taskContainer.classList.remove("hidden");
  taskStatus.classList.remove("hidden");
  taskField.value = "";

  //Storing the inputed tasks to the allTaskArr array
  const taskElements = Array.from(taskContainer.querySelectorAll(".task"));

  storeTask(taskElements[taskElements.length - 1]);
  activeTaskNoEl.textContent = renderActiveTaskNo();
});

const renderTask = function (task, status = "active", taskNo) {
  const markup = `
    
    <li data-task-no=${taskNo ? taskNo : index++} class="task ${status}"> 

          <span>
            <button class="check btn">
              <img class="hidden" src="./images/icon-check.svg" alt="" />
            </button>

            ${task}
          </span>

          <button class="remove btn hidden">
            <img src="./images/icon-cross.svg" alt="" />
          </button>
        </li>
        
       `;
  const [firstChild] = taskElementsContainer.children;

  if (firstChild?.tagName === "P") taskElementsContainer.innerHTML = "";

  taskElementsContainer.insertAdjacentHTML("beforeend", markup);
};

taskContainer.addEventListener("click", function (ev) {
  const taskEl = ev.target.closest(".task");

  if (taskEl) {
    //Toggling the completed functionality
    const taskCheckBtn = ev.target.closest(".check");
    if (taskCheckBtn) {
      taskCheckBtn.querySelector("img").classList.toggle("hidden");
      toggleCheck(taskEl);

      updateTaskStatus(taskEl);

      activeTaskNoEl.textContent = renderActiveTaskNo();
    }

    //Removing a task from the list
    const removeTaskBtn = ev.target.closest(".remove");
    if (removeTaskBtn) {
      taskElementsContainer.removeChild(taskEl);

      const tasks = Array.from(taskElementsContainer.children);

      if (tasks.length === 0) taskContainer.classList.add("hidden");

      updateallTaskArr(taskEl);
    }
  }

  const taskStatus = ev.target.closest(".task-status");
  if (!taskStatus) return;

  //rendering all tasks
  const allTasks = ev.target.closest(".all");
  if (allTasks) renderStatus(taskElementsContainer, "all", allTasks);

  //rendering the completed tasks
  const completedTasks = ev.target.closest(".completed");
  if (completedTasks)
    renderStatus(taskElementsContainer, "complete", completedTasks);

  //rendering active tasks
  const activeTasks = ev.target.closest(".active");
  if (activeTasks) renderStatus(taskElementsContainer, "active", activeTasks);

  //clearing completed tasks
  const clearCompleted = ev.target.closest(".clear-completed");
  if (clearCompleted) {
    clearCompletedTasks(taskElementsContainer);

    taskStatus.querySelectorAll("li").forEach((status) => {
      if (status.classList[1] === "current-task_display")
        renderStatus(taskElementsContainer, `${status.classList[0]}`, status);
    });
  }
});

const toggleCheck = function (el) {
  el.classList.toggle("active");
  el.classList.toggle("complete");
};

const storeTask = function (taskEl) {
  const todo = taskEl.querySelector("span").textContent.trim();

  const store = {
    status: taskEl.classList[1],
    dataset: taskEl.dataset.taskNo,
    task: todo,
  };

  allTaskArr.push(store);
};

const updateTaskStatus = function (taskEl) {
  allTaskArr.forEach((task) => {
    if (taskEl.dataset.taskNo !== task.dataset) return;

    if (task.status !== taskEl.classList[1]) {
      task.status = taskEl.classList[1];
    }
  });
};

const updateallTaskArr = function (taskEl) {
  allTaskArr.forEach((task, i) => {
    if (taskEl.dataset.taskNo === task.dataset) {
      allTaskArr.splice(i, 1);
    }
  });
};

const renderStatus = function (parentEl, status, statusBtn) {
  let tasks;

  taskStatus.querySelectorAll("li").forEach((status) => {
    status.classList.remove("current-task_display");
    statusBtn.classList.add("current-task_display");
  });

  tasks =
    status === "all"
      ? allTaskArr
      : allTaskArr.filter((task) => task.status === status);

  if (tasks.length === 0) {
    renderError(status);
    return;
  }

  parentEl.innerHTML = "";
  tasks.forEach((task) => {
    renderTask(task.task, task.status, task.dataset);
  });
};

const renderError = function (msg) {
  errorMessage = `<p class='err'>No ${msg === "all" ? "" : msg} tasks.</p>`;
  taskElementsContainer.innerHTML = "";
  taskElementsContainer.insertAdjacentHTML("afterbegin", errorMessage);
};

const clearCompletedTasks = function () {
  for (let i = allTaskArr.length - 1; i >= 0; i--) {
    if (allTaskArr[i].status === "complete") allTaskArr.splice(i, 1);
  }
};

const renderActiveTaskNo = function () {
  return allTaskArr.filter((task) => task.status === "active").length;
};
