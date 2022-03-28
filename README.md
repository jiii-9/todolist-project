# 이해하기 좋으려고 정리보다는 순서 위주로 작성했습니다.

## 1. 시작

<br />

**태그찾기**

```js
const toDoForm = document.querySelector(".input-box");
const toDoInput = document.querySelector(".input-box input");
const toDoList = document.querySelector(".todo-list");
const doBtn = document.querySelector(".do-btn");
```

<br />

## 2. todo를 생성해주는 함수

<br />

**초기화 할 때 많이 사용**

```js
function init() {
  loadToDos(); // localStroage에서 오는것을 load해주는 함수
}
```

<br />

## 3. todo 생성하고 local에 저장

<br />

**todo를 load해 줄 함수 생성**

```js
const TODOS_LS = "toDos";

function loadToDos() {
  const loadedToDos = localStorage.getItem(TODOS_KEY);
  if (loadedToDos !== null) {
    // 추가 예정
  }
}
```

<br />

**todo를 생성해주는 함수 생성**

```js
function init() {
  loadToDos();
  toDoForm.addEventListener("submit", handleSubmit);
}
```

<br />

**handleSubmit 함수 생성**

```js
function handleSubmit(event) {
  event.preventDefault(); // event의 기본 동작 막음
  const currentValue = toDoInput.value;
  paintToDo(currentValue);
  toDoInput.value = ""; // input창에 value 입려 후 enter했을 때 todo 생성 후 삭제
}
```

<br />

**paintToDo 함수 DOM 조작**

```js
function paintToDo(value) {
  const li = document.createElement("li");
  const toDoItem = document.createElement("div");
  toDoItem.classList.add("todo-item");
  const span = document.createElement("span");
  const delBtn = document.createElement("button");

  span.innerText = value;
  delBtn.innerText = "❌";

  toDoItem.appendChild(span);
  toDoItem.appendChild(delBtn);
  li.appendChild(toDoItem);
  toDoList.appendChild(li);
}
```

<br />

**todo-list를 담을 배열 생성**

```js
let toDos = [];
```

- 처음에는 const으로 작성했다가 후에 let으로 변경됨

<br />

**todo를 생성했을 때, toDos array에 추가**

```js
function paintToDo(value) {
  // (생략)

  const newId = toDos.length + 1;
  li.id = newId;

  const toDoObj = {
    text: value,
    id: TODOS_ID,
    done: false,
  };

  toDos.push(toDoObj);
}

// 객체로 저장하는 이유: local storage에도 todo를 저장해야되기 때문
```

<br />

**toDos를 가져와서 로컬에 저장하는 함수 생성**

```js
function saveToDos() {
  // toDos array에 있는 데이터를 저장
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}
```

- local storage에는 JS의 data 저장이 안되기 때문에 sting으로 변환시켜줌

```js
function paintToDo(value) {
  // (생략)
  saveToDos();
}
```

- toDos.push(toDoObj) 가 된 후에 호출되어야됨.  
  => 전에 호출하면 saveToDos를 불러도 저장할 데이터가 없음

<br />

**toDos를 불러오는 함수 생성 (새로고침 했을 때)**

```js
function loadToDos() {
  const loadedToDos = localStorage.getItem(TODOS_KEY);
  if (loadedToDos !== null) {
    const parseToDo = JSON.parse(loadedToDos);
    parseToDo.forEach(function (toDo) {
      paintToDos(toDo.text);
    });
  }
}
```

- localStorage.getItem() 으로 데이터 가져오기
- loadedToDos가 null이 아닌 경우에 local storage에 있는 데이터를 JS 객체로 변환
- 가져온 각각의 parseToDo에 대해 paintToDo() 함수 실행

<br />

## 4. todolist 삭제

<br />

**삭제하는 함수 생성**

```js
function deleteToDo(event) {}
```

<br />

**delBtn 만들기**

```js
function paintToDo(value) {
  // (생략)
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deleteToDo);
  // (생략)
}
```

<br />

**삭제 될 target 찾기**

```js
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
```

- filter() - filter함수는 array의 모든 아이템을 통해 함수를 실행하고 true인 아이템들만 가지고 새로운 array를 만듦
- forEach에서 function을 실행하는 것 같이 각각의 item과 같이 실행이 됨
- 이 때 toDos는 const에서 let으로 바꿔줘야 됨

<br />

## todolist 완료

<br />

**doneToDo함수 생성**

```js
function doneToDo(event) {
  const span = event.target;

  span.classList.toggle("done");
  const li = span.parentNode;
}
```

- toggle로 html class를 나타냈다 지웠다를 반복해 줄 수 있음

<br />

```css
section .main .list .todo-list .todo-item span.done {
  text-decoration: line-through;
  text-decoration-thickness: 2px;
  text-decoration-color: #ea3a17;
}
```

- 'done' class가 생기면 todo 가운데에 취소선이 그어짐
