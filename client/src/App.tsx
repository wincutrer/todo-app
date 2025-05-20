import React, { useEffect, useState, useRef } from "react";
import "./App.css";

type TaskType = {
  id: number;
  title: string;
  completed: boolean;
  dueDate: string | null;
};

function App() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  useEffect(() => {
    fetch("http://localhost:3001/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmed) return;

    fetch(`http://localhost:3001/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      })
      .catch((err) => console.error("Delete failed: ", err));
  }

  function handleToggleComplete(id: number, newStatus: boolean) {
    fetch(`http://localhost:3001/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: newStatus }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
      })
      .catch((err) => console.error("Toggle failed:", err));
  }

  function handleSaveEdit(id: number) {
    fetch(`http://localhost:3001/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editTitle,
        dueDate: editDueDate || null,
      }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
        setEditingId(null);
        setEditTitle("");
        setEditDueDate("");
      })
      .catch((err) => console.error("Edit failed:", err));
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>My ToDo List</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          fetch("http://localhost:3001/tasks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: title,
              dueDate: dueDate || null,
            }),
          })
            .then((res) => res.json())
            .then((newTask) => {
              setTasks((prev) => [...prev, newTask]);
              setTitle("");
              setDueDate("");
            })
            .catch((err) => console.error("Error adding task:", err));
        }}
        style={{ marginBottom: "2rem" }}
      >
        <div>
          <label>
            Task Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>

        <div style={{ marginTop: "0.5rem" }}>
          <label>
            Due Date:
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Add Task
        </button>
      </form>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {editingId === task.id ? (
                <>
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveEdit(editingId!);
                      }
                    }}
                  />

                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                  />
                  <button onClick={() => handleSaveEdit(task.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      handleToggleComplete(task.id, !task.completed)
                    }
                  />
                  {task.title}
                  {task.dueDate && <em> (Due: {task.dueDate})</em>}
                  <button
                    style={{ marginLeft: "1rem" }}
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                  <button
                    style={{ marginLeft: "0.5rem" }}
                    onClick={() => {
                      setEditingId(task.id);
                      setEditTitle(task.title);
                      setEditDueDate(task.dueDate ?? "");
                    }}
                  >
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
