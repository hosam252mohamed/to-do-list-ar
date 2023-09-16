let form = document.querySelector("form");
let inputField = document.querySelector("input[type='text']");
let addTaskBtn = document.querySelector("input[type='submit']");
let tasks = document.querySelector(".tasks");
let deleteTask = document.querySelector(".task .delete");
let tasksNotCompleted = document.querySelector(
  ".container .tasks-not-completed span"
);
let tasksCompleted = document.querySelector(".container .tasks-completed span");

window.onload = function () {
  inputField.focus();
};

let tasksCount = 0;

let allDataInTasks = [];

if (localStorage.getItem("tasks")) {
  let data = JSON.parse(localStorage.getItem("tasks"));
  for (let i = 0; i < data.length; i++) {
    allDataInTasks.push({
      title: data[i].title,
      done: data[i].done,
    });
    createTask(data[i].title, data[i].done);
  }
}

form.onsubmit = function (e) {
  e.preventDefault();
  if (inputField.value === "") return false;
  else {
    createTask(inputField.value);

    swal({
      title: "تم اضافة المهمة بنجاح",
      icon: "success",
      text: "تم الحفظ فى الذاكرة للوصول لها لاحقا",
      button: "تم",
    });

    document.querySelector(".add-task-sound").play();

    allDataInTasks.push({
      title: inputField.value,
      done: 0,
    });
    localStorage.setItem("tasks", JSON.stringify(allDataInTasks));

    inputField.value = "";
  }
};

function createTask(inputValue, done) {
  if (document.querySelector(".tasks .no-tasks"))
    document.querySelector(".tasks .no-tasks").remove();

  let divTask = document.createElement("div");
  divTask.className = "task";
  tasks.append(divTask);

  let ptext = document.createElement("p");
  ptext.className = "task-title";
  ptext.appendChild(document.createTextNode(inputValue));
  divTask.appendChild(ptext);

  let deleteBtn = document.createElement("button");
  deleteBtn.className = "delete";
  deleteBtn.appendChild(document.createTextNode("حذف"));
  divTask.appendChild(deleteBtn);

  if (done === 1) {
    divTask.classList.add("done");
    tasksCompleted.innerHTML = +tasksCompleted.innerHTML + 1;
  } else tasksNotCompleted.innerHTML = +tasksNotCompleted.innerHTML + 1;
}

document.addEventListener("click", function (e) {
  if (e.target.className === "delete") {
    swal({
      title: "هل انت متأكد؟",
      text: "بمجرد حذف المهمة لن تتمكن من الوصول لها لاحقا",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          checkDeleted = willDelete;
          swal("تم حذف المهمة بنجاح!", {
            icon: "success",
          });
          return willDelete;
        }
      })
      .then((deleteCheck) => {
        if (deleteCheck) {
          if (e.target.parentNode.classList.contains("done"))
            tasksCompleted.innerHTML -= 1;
          else tasksNotCompleted.innerHTML -= 1;

          e.target.parentNode.remove();

          if (tasks.children.length === 0) {
            addNoTaskMsg();
          }

          document.querySelector(".add-task-sound").play();

          allDataInTasks.forEach(function (el) {
            if (el.title === e.target.previousSibling.textContent) {
              allDataInTasks.splice(allDataInTasks.indexOf(el), 1);
            }
          });
          if (allDataInTasks.length)
            localStorage.setItem("tasks", JSON.stringify(allDataInTasks));
          else localStorage.clear("tasks");
        }
      });
  }

  if (
    e.target.classList.contains("task") ||
    e.target.className === "task-title"
  ) {
    let ourtask =
      e.target.className === "task-title" ? e.target.parentNode : e.target;

    ourtask.classList.toggle("done");
    if (ourtask.classList.contains("done")) {
      tasksCompleted.innerHTML = +tasksCompleted.innerHTML + 1;
      tasksNotCompleted.innerHTML -= 1;

      document.querySelector(".success-sound").play();

      editingArrayData(ourtask, 1);
    } else {
      tasksNotCompleted.innerHTML = +tasksNotCompleted.innerHTML + 1;
      tasksCompleted.innerHTML -= 1;

      editingArrayData(ourtask, 0);
    }
  }
});

function editingArrayData(el, done) {
  allDataInTasks.forEach((element, i) => {
    if (el.children[0].textContent === element.title) {
      allDataInTasks[i].done = done;
      localStorage.setItem("tasks", JSON.stringify(allDataInTasks));
    }
  });
}

function addNoTaskMsg() {
  let noTaskText = document.createElement("span");
  noTaskText.appendChild(document.createTextNode("لا يوجد مهام لإظهارها"));
  noTaskText.className = "no-tasks";
  tasks.appendChild(noTaskText);
}

document.querySelector(".remove-all").onclick = function () {
  localStorage.clear("tasks");
  document.querySelectorAll(".tasks .task").forEach((el) => el.remove());
  allDataInTasks = [];
  tasksCompleted.innerHTML = 0;
  tasksNotCompleted.innerHTML = 0;
  if (tasks.children.length === 0) addNoTaskMsg();
  inputField.focus();
};
