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
    console.log(res)
    const newTodo = res.data.map((a) => {
      return { id: a.id, text: a.title, description: a.description, isComplete: Boolean(a.isDone)}
    })
    setTodos(newTodo)
    console.log(todos)
    } catch (error) {
      console.error(`Couldn't retrieve ToDos: ${error.message}`)
    }
  }
  
  useEffect(() => {
    getTodo()
  }, []);

  // Agrega nuevo elemento de ToDo a la base de datos
  const addTodo = async (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }
    const { text, description } = todo
    try {
      const request = await fetch("http://localhost:4000/api", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title: text, description: description.length>0 ? description : " "})
    })
    console.log(await request.json())
    } catch (error) {
      console.error(`Couldn't retrieve ToDos: ${error.message}`)
    }
    getTodo()
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
      const request = await fetch(`http://localhost:4000/api/${todoId}`, {
      method: "PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title: text, description: description.length>0 ? description : " ", isDone:0})
    })
    console.log(await request.json())
    } catch (error) {
      console.error(`Couldn't retrieve ToDos: ${error.message}`)
    }
    getTodo()
  };

  // Elimina elemento de la base de datos
  const removeTodo = async (id) => {
    try {
      const request = await fetch(`http://localhost:4000/api/${id}`, {
      method: "DELETE"
    })
    console.log(await request.json())
    } catch (error) {
      console.error(`Couldn't retrieve ToDos: ${error.message}`)
    }
    getTodo()
  };

  const completeTodo = async (id) => {
    try {
      const todo = todos.filter((a) => a.id === id)
      if(todo.length === 0) {
        return;
      }
      const request = await fetch(`http://localhost:4000/api/${id}`, {
      method: "PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: todo[0].text, isDone: Number(!todo[0].isComplete), description: todo[0].description})
    })
    console.log(await request.json())
    } catch (error) {
      console.error(`Couldn't retrieve ToDos: ${error.message}`)
    }
    getTodo()
  };

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={addTodo} />
      {todos.length>0 ? <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        showDescription={showDescription}
      /> : <h4 style={{color: "white"}}>There is nothing to do...</h4>}
    </>
  );
}

export default TodoList;
