import { useState, useEffect } from 'react'

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

  const addTodo = (text: string) =>
    setTodos(prevTodos => [...prevTodos, { id: crypto.randomUUID(), text, done: false }])

  const deleteTodo = (id: string) =>
    setTodos(prevTodos => prevTodos.filter(prevTodo => prevTodo.id !== id))




  useEffect(() => {
    localStorage.setItem("todosData", JSON.stringify(todos))
  }, [todos])


  return (
    <>
      <section id="center">
        {(["all", "active", "done"] as const).map(filterMode => <button key={filterMode} onClick={() => setFilter(filterMode)}>{filterMode[0].toUpperCase() + filterMode.slice(1)}</button>)}
        {visibleTodos.map(todo => <div key={todo.id} id={todo.id}><button onClick={() => toggleTodo(todo.id)}>{todo.done ? `✅` : `⬜`}</button>{todo.text}<button onClick={() => deleteTodo(todo.id)}>🗑️</button></div>)}
        <form onSubmit={e => {
          e.preventDefault();
          addTodo(taskName);
          setTaskName("");
        }}>
          <input value={taskName} onChange={e => setTaskName(e.target.value)} />
          <button type='submit'>Add</button>
        </form>
      </section >
    </>
  )
}

export default App
