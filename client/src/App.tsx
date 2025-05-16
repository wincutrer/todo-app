import React, { useEffect, useState } from "react";
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
              {task.completed ? "✅" : "⬜️"} {task.title}{" "}
              {task.dueDate && <em>(Due: {task.dueDate})</em>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
