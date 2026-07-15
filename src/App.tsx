import { useState, useEffect } from 'react'

import "./App.css";

interface Todos {
  id: string;
  text: string;
  done: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todos[]>(() => {
    const todosData = localStorage.getItem("todosData")
    if (todosData === null) return [];
    try {
      return JSON.parse(todosData);
    } catch {
      return [];
    }
  })
  const [taskName, setTaskName] = useState<string>("")
  const [filter, setFilter] = useState<"all" | "active" | "done">("all")

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case "active":
        return todo.done === false
      case "done":
        return todo.done === true
      default:
        return true
    }
  })
  const toggleTodo = (id: string) =>
    setTodos(prevTodos => prevTodos.map(prevTodo => prevTodo.id === id ? { ...prevTodo, done: !prevTodo.done } : prevTodo))

  const addTodo = (text: string) => {
    const cleanedText: string = text.trim()
    if (cleanedText.length !== 0)
      setTodos(prevTodos => [...prevTodos, { id: crypto.randomUUID(), text: cleanedText, done: false }]);
  }

  const deleteTodo = (id: string) =>
    setTodos(prevTodos => prevTodos.filter(prevTodo => prevTodo.id !== id))




  useEffect(() => {
    localStorage.setItem("todosData", JSON.stringify(todos))
  }, [todos])


  return (
    <>
      <section id="center">
        <div className='filters'>
          {(["all", "active", "done"] as const).map(filterMode => <button key={filterMode} onClick={() => setFilter(filterMode)} aria-current={filter === filterMode ? "page" : undefined}
          >{filterMode[0].toUpperCase() + filterMode.slice(1)}</button>)}
        </div>
        {visibleTodos.length === 0 && `No todos yet ✨`}
        {visibleTodos.map(todo => <div className={todo.done ? "todo done" : "todo"} key={todo.id}><button aria-pressed={todo.done} onClick={() => toggleTodo(todo.id)}>{todo.done ? `✅` : `⬜`}</button>{todo.text}<button className='todo-delete' onClick={() => deleteTodo(todo.id)}>🗑️</button></div>)}
        <form className="add-form" onSubmit={e => {
          e.preventDefault();
          addTodo(taskName);
          setTaskName("");
        }}>
          <input value={taskName} onChange={e => setTaskName(e.target.value)} />
          <button type='submit' disabled={taskName.trim().length === 0}>Add</button>
        </form>
      </section >
    </>
  )
}

export default App
