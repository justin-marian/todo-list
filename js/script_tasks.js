// Event alert when the page loads
window.addEventListener('load', () => alert("Loading List of Tasks TODO"));

// Selectors
const taskInput = document.querySelector(".introduceNewTask input");
const addTaskButton = document.querySelector(".introduceNewTask button");
const filterButtons = document.querySelectorAll(".filters span");
const clearAllButton = document.querySelector(".clear-btn");
const taskBox = document.querySelector(".task-box");
let allTasks = JSON.parse(localStorage.getItem("todo-list")) || [];

let editTaskId;
let isEditTask = false;

// Load tasks on page load
showTasks("all");

// Event listeners for filter buttons
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".filters .all").classList.remove("all");
        btn.classList.add("all");
        showTasks(btn.id);
    });
});

// Show task menu (edit/delete)
function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    let taskItem = selectedTask.closest(".task");
    let taskItems = document.querySelectorAll(".task");
    let taskIndex = Array.from(taskItems).indexOf(taskItem);
    let taskCount = taskItems.length;
    
    if (taskCount === 1) {
        menuDiv.style.top = "-25px";
    } else if (taskIndex === 0) {
        menuDiv.style.top = "5px";
    } else if (taskIndex === taskCount - 1) {
        menuDiv.style.top = "-50px";
    } else {
        menuDiv.style.top = "-40px";
    }

    menuDiv.classList.add("show");

    document.addEventListener("click", e => {
        if (!menuDiv.contains(e.target) && e.target !== selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

// Update task status
function updateStatus(selectedTask) {
    let taskId = selectedTask.id;
    let taskName = selectedTask.nextElementSibling;
    let taskItem = selectedTask.closest(".task");
    
    let isFinished = selectedTask.checked;
    allTasks[taskId].status = isFinished ? "finished" : "inProgress";

    localStorage.setItem("todo-list", JSON.stringify(allTasks));

    if (document.querySelector(".filters .all").id === "inProgress" && isFinished) {
        taskItem.style.opacity = "0";
        setTimeout(() => taskItem.remove(), 300);
    }
    
    if (document.querySelector(".filters .all").id === "finished" && !isFinished) {
        taskItem.style.opacity = "0";
        setTimeout(() => taskItem.remove(), 300);
    }

    if (isFinished) {
        taskName.style.fontWeight = "bold";
        taskName.style.color = "black";
        taskName.classList.add("checked");
    } else {
        taskName.style.fontWeight = "normal";
        taskName.style.color = "#666";
        taskName.classList.remove("checked");
    }
}

// Edit task
function editTask(taskId, textName) {
    isEditTask = true;
    editTaskId = taskId;
    taskInput.value = textName;
    taskInput.focus();
}

// Delete task
function deleteTask(deleteId, filter) {
    allTasks.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(allTasks));
    showTasks(filter);
}

// Clear all tasks
clearAllButton.addEventListener("click", () => {
    allTasks = [];
    localStorage.setItem("todo-list", JSON.stringify(allTasks));
    showTasks("all");
});

// Add new task function
function addNewTask() {
    let userTask = taskInput.value.trim();
    if (userTask) {
        let taskStatus = "inProgress";
        if (userTask.toLowerCase().includes("done") || userTask.toLowerCase().includes("finished")) {
            taskStatus = "finished";
        }
        allTasks.push({ name: userTask, status: taskStatus });
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(allTasks));
        showTasks(document.querySelector(".filters .all").id);
    }
}

// Add task on button click
addTaskButton.addEventListener("click", addNewTask);

// Add new task on Enter key press
taskInput.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        addNewTask();
    }
});

// Display tasks
function showTasks(filter) {
    let liTags = allTasks.map((task, id) => {
        if (filter === "all" || filter === task.status) {
            let finished = task.status === "finished" ? "checked" : "";
            let fontStyle = task.status === "finished" ? "font-weight: bold; color: black;" : "";
            return `<li class="task">
                        <label for="${id}">
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${finished}>
                            <p class="${finished}" style="${fontStyle}">${task.name}</p>
                        </label>
                        <div class="settings">
                            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                            <ul class="task-menu">
                                <li onclick='editTask(${id}, "${task.name}")'><i class="uil uil-pen"></i>Edit</li>
                                <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                            </ul>
                        </div>
                    </li>`;
        }
        return "";
    }).join("");

    taskBox.innerHTML = liTags || `<span>Planify new tasks | Homeworks | Projects</span>`;
    clearAllButton.classList.toggle("all", taskBox.querySelectorAll(".task").length);
    taskBox.classList.toggle("overflow", taskBox.offsetHeight >= 300);
}
