import React, { useEffect, useRef, useState } from "react";
import "./index.css";

export default function App() {
  const initialState = JSON.parse(localStorage.getItem("todos")) || [];
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState(initialState);
  const [editTodo, setEditTodo] = useState(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <div className="container">
      <h1>Todo-List</h1>
      <FormInput
        todos={todos}
        onSetTodos={setTodos}
        onSetInput={setInput}
        input={input}
        onEditTodo={setEditTodo}
        editTodo={editTodo}
      />
      <List
        todos={todos}
        onSetTodos={setTodos}
        onEditTodo={setEditTodo}
        editTodo={editTodo}
      />
    </div>
  );
}

function FormInput({
  todos,
  input,
  onSetTodos,
  onSetInput,
  editTodo,
  onEditTodo,
}) {
  const inputRef = useRef();

  function updateTodo(title, id, completed) {
    const newTodo = todos.map((todo) =>
      todo.id === id ? { title, id, completed } : todo
    );
    onSetTodos(newTodo);
    onEditTodo("");
  }

  useEffect(() => {
    if (editTodo) {
      onSetInput(editTodo.title);
      inputRef.current.focus();
    } else {
      onSetInput("");
    }
  }, [editTodo]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!editTodo) {
      if (!input) return;
      const id = crypto.randomUUID();
      onSetTodos([{ id: id, title: input, completed: false }, ...todos]);
      onSetInput("");
    } else {
      updateTodo(input, editTodo.id, editTodo.completed);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => onSetInput(e.target.value)}
        className="task-input"
        type="text"
        placeholder="Enter a Todo..."
      />
      <button className="button-add" type="submit">
        {editTodo ? "Ok" : "Add"}
      </button>
    </form>
  );
}

function List({ todos, onSetTodos, onEditTodo }) {
  function handleDelete({ id }) {
    onSetTodos(todos.filter((todo) => todo.id !== id));
  }

  function handleComplete(todo) {
    onSetTodos(
      todos.map((item) => {
        if (item.id === todo.id) {
          return { ...item, completed: !item.completed };
        }
        return item;
      })
    );
  }

  function handleEdit({ id }) {
    onEditTodo(todos.find((item) => item.id === id));
  }

  return (
    <div>
      <ul className="item">
        {todos.map((todo) => (
          <li className="list-item" key={todo.id}>
            <input
              type="text"
              value={todo.title}
              className={`list ${todo.completed ? "complete" : ""}`}
              onChange={(e) => e.preventDefault()}
            />
            <div>
              <button
                className="button-complete"
                onClick={() => handleComplete(todo)}
              >
                <i className="fa fa-check-circle"></i>
              </button>
              <button className="button-edit" onClick={() => handleEdit(todo)}>
                <i className="fa fa-edit"></i>
              </button>
              <button
                className="button-delete"
                onClick={() => handleDelete(todo)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
