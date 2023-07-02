import React, { useState } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import { useEffect } from "react";

function TodoList() {
  const [todos, setTodos] = useState([]);

  // Consulta la base de datos para traer la lista de ToDos
  const getTodo = async () => {
    try {
      const response = await fetch("http://localhost:4000/api", {
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
  }
  
  useEffect(async () => {
    getTodo()
  }, []);

  // Agrega nuevo elemento de ToDo a la base de datos
  const addTodo = async (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }
    const { text, description } = todo
    try {
      const request = await fetch("https://todo-api-h8ov.onrender.com/api", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title: text, description: description.length>0 ? description : " "})
    })
    const res = await request.json()
    console.log(res)
    } catch (error) {
      console.error(`Couldn't retrieve ToDos: ${error.message}`)
    }
    getTodo()
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

  // Update al elemento todo
  const updateTodo = async (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }
    const { text, description } = newValue
    try {
      const request = await fetch(`https://todo-api-h8ov.onrender.com/api/${todoId}`, {
      method: "PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title: text, description: description.length>0 ? description : " "})
    })
    const res = await request.json()
    console.log(res)
    } catch (error) {
      console.error(`Couldn't retrieve ToDos: ${error.message}`)
    }
    getTodo()
    console.log(...todos);
    /* console.log(newValue)
    setTodos((prev) =>
      prev.map((item) => (item.id === todoId ? newValue : item))
    ); */
  };

  // Elimina elemento de la base de datos
  const removeTodo = async (id) => {
    try {
      const request = await fetch(`https://todo-api-h8ov.onrender.com/api/${id}`, {
      method: "DELETE"
    })
    const res = await request.json()
    console.log(res)
    } catch (error) {
      console.error(`Couldn't retrieve ToDos: ${error.message}`)
    }
    getTodo()
  };

  const completeTodo = async (id) => {
    try {
      const request = await fetch(`https://todo-api-h8ov.onrender.com/api/${id}`, {
      method: "PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isDone: false})
    })
    const res = await request.json()
    console.log(res)
    } catch (error) {
      console.error(`Couldn't retrieve ToDos: ${error.message}`)
    }
    getTodo()
    /* let updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.isComplete = !todo.isComplete;
      }
      return todo;
    }); */
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
