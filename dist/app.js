"use strict";
// DOM Elements :::
const $ = document;
const todoForm = $.getElementById("todo-form");
const todoInput = $.getElementById("title");
const errorTextElem = $.getElementById("title-error");
const todoTableElem = $.getElementById("todo-list");
// Functions :::
// --Todo UI :
class UI {
    static addTodo(todoObj) {
        todoTableElem.insertAdjacentHTML("afterbegin", `<tr>
                  <th scope="row">#${todoObj.id}</th>
                  <td>${todoObj.title}</td>
                  <td>
                  <input type="checkbox" ${todoObj.status === true ? "checked" : ""} class="form-check-input" onclick="StoreTodos.changeTodoStatus(${todoObj.id})" />
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" onclick = "deleteTodo(event,${todoObj.id})">
                      delete
                    </button>
                  </td>
                </tr>`);
    }
}
//LocalStorage :
class StoreTodos {
    static saveTodo(todoObj) {
        let todosArray;
        if (localStorage.getItem("todos")) {
            todosArray = JSON.parse(localStorage.getItem("todos"));
        }
        else {
            todosArray = [];
        }
        todosArray.push(todoObj);
        localStorage.setItem("todos", JSON.stringify(todosArray));
    }
    static getTodosInfo() {
        const savedTodos = JSON.parse(localStorage.getItem("todos"));
        savedTodos.forEach((todoObj) => {
            UI.addTodo(todoObj);
        });
    }
    static removeTodo(id) {
        let todosList = JSON.parse(localStorage.getItem("todos"));
        const newTodos = todosList.filter((todoObj) => {
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
    static changeTodoStatus(id) {
        let todosList = JSON.parse(localStorage.getItem("todos"));
        const newTodos = todosList.map((todoObj) => {
            return todoObj.id === id
                ? Object.assign(Object.assign({}, todoObj), { status: !todoObj.status }) : todoObj;
        });
        localStorage.setItem("todos", JSON.stringify(newTodos));
    }
}
// Add and Save todo :
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const todoTitle = todoInput.value.trim();
    // --Todo object :
    const todoObj = {
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
    }
    else {
        errorTextElem.innerHTML = "Title is required ...";
    }
});
// Remove todo :
function deleteTodo(e, id) {
    const deletedTodo = e.target.parentElement.parentElement;
    deletedTodo.remove();
    StoreTodos.removeTodo(id);
}
// Get todos info after DOM load :
$.addEventListener("DOMContentLoaded", () => {
    StoreTodos.getTodosInfo();
});
