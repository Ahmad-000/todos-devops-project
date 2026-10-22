
import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/todos`;

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch todos from the backend
  async function fetchTodos() {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }

      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError("Could not connect to the backend. Check that it is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add a new todo
  async function addTodo(event) {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      const newTodo = await response.json();

      setTodos((previousTodos) => [newTodo, ...previousTodos]);
      setTitle("");
    } catch (err) {
      setError("Could not add the todo. Please try again.");
    }
  }

  // Mark a todo complete or incomplete
  async function toggleTodo(todo) {
    try {
      setError("");

      const response = await fetch(`${API_URL}/${todo._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      const updatedTodo = await response.json();

      setTodos((previousTodos) =>
        previousTodos.map((item) =>
          item._id === updatedTodo._id ? updatedTodo : item
        )
      );
    } catch (err) {
      setError("Could not update the todo. Please try again.");
    }
  }

  // Delete a todo
  async function deleteTodo(id) {
    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      setTodos((previousTodos) =>
        previousTodos.filter((todo) => todo._id !== id)
      );
    } catch (err) {
      setError("Could not delete the todo. Please try again.");
    }
  }

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <main className="page">
      <section className="todo-card">
        <header className="header">
          <p className="eyebrow">MY PRODUCTIVITY SPACE</p>
          <h1>Todo List<span>.</span></h1>
          <p className="subtitle">
            Small steps every day lead to big results.
          </p>
        </header>

        <form className="todo-form" onSubmit={addTodo}>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What do you need to do?"
            aria-label="New todo title"
            maxLength={200}
          />
          <button type="submit">Add task</button>
        </form>

        {error && (
          <div className="error" role="alert">
            {error}
            <button type="button" onClick={fetchTodos}>
              Retry
            </button>
          </div>
        )}

        <div className="list-heading">
          <h2>Your tasks</h2>
          <span>{completedCount}/{todos.length} completed</span>
        </div>

        {loading ? (
          <p className="empty-state">Loading your tasks...</p>
        ) : todos.length === 0 ? (
          <p className="empty-state">
            No tasks yet. Add your first task above!
          </p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <label className="todo-label">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                  />
                  <span>{todo.title}</span>
                </label>

                <button
                  className="delete-button"
                  type="button"
                  onClick={() => deleteTodo(todo._id)}
                  aria-label={`Delete ${todo.title}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer>
          <span>Todo App</span>
          <span>Built with React + Node.js + MongoDB</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
