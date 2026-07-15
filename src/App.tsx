import { useState, useEffect } from 'react'

import "./App.css";

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

type Filter = "all" | "active" | "done"

interface TodoListStatusProps {
  totalCount: number;
  filteredCount: number;
  filter: Filter;
}

const FILTERS = ["all", "active", "done"] as const satisfies readonly Filter[];

const FILTER_LABELS: Record<Filter, string> = {
  all: "All",
  active: "Active",
  done: "Done"
}

const TodoListStatus = ({ totalCount, filteredCount, filter }: TodoListStatusProps) => {
  if (totalCount === 0) {
    return <p className="text-gray-500">No todos yet ✨</p>
  }


  if (filteredCount === 0) {
    return <p className="text-gray-500">No matches for filter: {FILTER_LABELS[filter]} 🔍</p>
  }

  return null;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const todosData = localStorage.getItem("todosData")
    if (todosData === null) return [];
    try {
      return JSON.parse(todosData);
    } catch {
      return [];
    }
  })
  const [taskName, setTaskName] = useState<string>("")
  const [filter, setFilter] = useState<Filter>("all")

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
          {FILTERS.map(filterMode => <button key={filterMode} onClick={() => setFilter(filterMode)} aria-current={filter === filterMode ? "page" : undefined}
          >{FILTER_LABELS[filterMode]}</button>)}
        </div>
        <TodoListStatus totalCount={todos.length} filteredCount={visibleTodos.length} filter={filter} />
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
