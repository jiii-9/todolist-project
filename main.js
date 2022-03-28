const toDoForm = document.querySelector(".input-box");
const toDoInput = document.querySelector(".input-box input");
const toDoList = document.querySelector(".todo-list");
const doBtn = document.querySelector(".do-btn");

let toDos = [];

const TODOS_KEY = "toDos";

function saveToDos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

function paintToDos(value) {
  const li = document.createElement("li");
  const toDoItem = document.createElement("div");
  toDoItem.classList.add("todo-item");
  const span = document.createElement("span");
  const delBtn = document.createElement("button");
  const TODOS_ID = toDos.length + 1;

  li.id = TODOS_ID;
  span.innerText = value;
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deleteToDo);
  span.addEventListener("click", doneToDo);

  toDoItem.appendChild(span);
  toDoItem.appendChild(delBtn);
  li.appendChild(toDoItem);
  toDoList.appendChild(li);

  const toDoObj = {
    text: value,
    id: TODOS_ID,
    done: false,
  };

  toDos.push(toDoObj);
  saveToDos();
}

function handleSubmit(event) {
  event.preventDefault();
  const currentValue = toDoInput.value;
  paintToDos(currentValue);
  toDoInput.value = "";
}

function doneToDo(event) {
  const span = event.target;

  span.classList.toggle("done");
  const li = span.parentNode;

  saveToDos();
}

function deleteToDo(event) {
  const btn = event.target;
  const div = btn.parentNode;
  const li = div.parentNode; //지워야 할 li인 btn.parentNode를 만듦
  toDoList.removeChild(li); // 여기까지 했을 때 문제점: 새로고침하면 다시 리스트가 생겨남 (localstorage에서 지워지지 않았기 때문)
  const cleanToDos = toDos.filter(function (toDo) {
    return toDo.id !== parseInt(li.id);
  });
  toDos = cleanToDos;
  saveToDos();
}

function loadToDos() {
  const loadedToDos = localStorage.getItem(TODOS_KEY);
  if (loadedToDos !== null) {
    const parseToDo = JSON.parse(loadedToDos);
    parseToDo.forEach(function (toDo) {
      paintToDos(toDo.text);
    });
  }
}

function init() {
  loadToDos();
  toDoForm.addEventListener("submit", handleSubmit);
  doBtn.addEventListener("click", handleSubmit);
}

init();
