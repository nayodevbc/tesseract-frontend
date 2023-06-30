import React, { useState } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import { useEffect } from "react";

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(async () => {
    try {
      const response = await fetch("https://todo-api-h8ov.onrender.com/api", {
      method: "GET"
    })
    const res = await response.json()
    console.log(res.data)
    const newTodo = res.data.map((a) => {
      return { id: a.id, text: a.title, description: a.description}
    })
    setTodos(newTodo)
    } catch (error) {
      console.error(`Couldn't retrieve ToDos: ${error.message}`)
    }
  });

  const addTodo = async (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    const { text, description } = todo
    console.log("todo:",text,description)
    try {
      const request = await fetch("https://todo-api-h8ov.onrender.com/api", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title: text, description: description})
    })
    const res = await request.json()
    console.log(res)
    } catch (error) {
      console.error(`Couldn't retrieve ToDos: ${error.message}`)
    }

    const newTodos = [todo, ...todos];

    setTodos(newTodos);
    console.log(...todos);
  };

  const showDescription = (todoId) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        todo.showDescription = !todo.showDescription;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }

    setTodos((prev) =>
      prev.map((item) => (item.id === todoId ? newValue : item))
    );
  };

  const removeTodo = (id) => {
    const removedArr = [...todos].filter((todo) => todo.id !== id);

    setTodos(removedArr);
  };

  const completeTodo = (id) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.isComplete = !todo.isComplete;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        showDescription={showDescription}
      />
    </>
  );
}

export default TodoList;
