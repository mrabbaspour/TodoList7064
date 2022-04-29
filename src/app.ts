"use strict";

// DOM Elements :::

const $ = document;
const todoForm = $.getElementById("todo-form") as HTMLFormElement;
const todoInput = $.getElementById("title") as HTMLInputElement;
const errorTextElem = $.getElementById("title-error") as HTMLParagraphElement;
const todoTableElem = $.getElementById("todo-list") as HTMLTableElement;

// --Todo object type :
interface TodoInterface {
  id: number;
  title: string;
  status: boolean;
}

// Functions :::

// --Todo UI :
class UI {
  static addTodo(todoObj: TodoInterface) {
    todoTableElem.insertAdjacentHTML(
      "afterbegin",
      `<tr>
                  <th scope="row">#${todoObj.id}</th>
                  <td>${todoObj.title}</td>
                  <td>
                  <input type="checkbox" ${
                    todoObj.status === true ? "checked" : ""
                  } class="form-check-input" onclick="StoreTodos.changeTodoStatus(${
        todoObj.id
      })" />
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" onclick = "deleteTodo(event,${
                      todoObj.id
                    })">
                      delete
                    </button>
                  </td>
                </tr>`
    );
  }
}

//LocalStorage :
class StoreTodos {
  static saveTodo(todoObj: TodoInterface) {
    let todosArray: TodoInterface[];
    if (localStorage.getItem("todos")) {
      todosArray = JSON.parse(localStorage.getItem("todos")!);
    } else {
      todosArray = [];
    }
    todosArray.push(todoObj);
    localStorage.setItem("todos", JSON.stringify(todosArray));
  }

  static getTodosInfo() {
    const savedTodos: TodoInterface[] = JSON.parse(
      localStorage.getItem("todos")!
    );
    savedTodos.forEach((todoObj: TodoInterface) => {
      UI.addTodo(todoObj);
    });
  }

  static removeTodo(id: number) {
    let todosList = JSON.parse(localStorage.getItem("todos")!);
    const newTodos = todosList.filter((todoObj: TodoInterface) => {
      return todoObj.id !== id;
    });
    localStorage.setItem("todos", JSON.stringify(newTodos));
    // sweetAlert :
    Swal.fire({
      position: "top",
      icon: "error",
      title: "Deleted",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  static changeTodoStatus(id: number) {
    let todosList = JSON.parse(localStorage.getItem("todos")!);
    const newTodos = todosList.map((todoObj: TodoInterface) => {
      return todoObj.id === id
        ? { ...todoObj, status: !todoObj.status }
        : todoObj;
    });
    localStorage.setItem("todos", JSON.stringify(newTodos));
  }
}

// Add and Save todo :
todoForm.addEventListener("submit", (e: Event) => {
  e.preventDefault();

  const todoTitle: string = todoInput.value.trim();

  // --Todo object :
  const todoObj: TodoInterface = {
    id: Math.round(Math.random() * 100),
    title: todoTitle,
    status: false,
  };

  if (todoTitle !== "") {
    // Clear error text :
    errorTextElem.innerHTML = "";
    todoInput.value = "";
    todoInput.focus();
    UI.addTodo(todoObj);
    StoreTodos.saveTodo(todoObj);
  } else {
    errorTextElem.innerHTML = "Title is required ...";
  }
});

// Remove todo :
function deleteTodo(e: Event, id: number) {
  const deletedTodo = e.target!.parentElement!.parentElement;
  deletedTodo.remove();
  StoreTodos.removeTodo(id);
}

// Get todos info after DOM load :
$.addEventListener("DOMContentLoaded", () => {
  StoreTodos.getTodosInfo();
});
