import React, { useEffect, useState, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import "./App.css";

type TaskType = {
  id: number;
  title: string;
  completed: boolean;
  order: number;
};

function App() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

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

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();

    fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks((prev) => [...prev, newTask]);
        setTitle("");
      })
      .catch((err) => console.error("Add failed:", err));
  }

  function handleDelete(id: number) {
    fetch(`http://localhost:3001/tasks/${id}`, { method: "DELETE" })
      .then(() => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      })
      .catch((err) => console.error("Delete failed:", err));
  }

  function handleToggleComplete(id: number, newStatus: boolean) {
    fetch(`http://localhost:3001/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
        setEditingId(null);
        setEditTitle("");
      })
      .catch((err) => console.error("Edit failed:", err));
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const reordered = Array.from(tasks);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const updated = reordered.map((task, index) => ({
      ...task,
      order: index,
    }));
    setTasks(updated);

    // FIXED: Send correct payload to backend
    fetch("http://localhost:3001/tasks/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        updated.map((task) => ({ id: task.id, order: task.order }))
      ),
    }).catch((err) => console.error("Reorder failed:", err));
  }

  return (
    <>
      <img
        src="/dark-mode.png"
        alt="Toggle Dark Mode"
        onClick={() => setDarkMode((prev) => !prev)}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          width: "32px",
          height: "32px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      />

      <div className={`container ${darkMode ? "dark" : ""}`}>
        <h1>todo</h1>
        <form onSubmit={handleAddTask} className="form">
          <input
            type="text"
            placeholder="Add new task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button type="submit">+</button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <ul
                  className="task-list"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div
                            className={`custom-checkbox ${
                              task.completed ? "checked" : ""
                            }`}
                            onClick={() =>
                              handleToggleComplete(task.id, !task.completed)
                            }
                          ></div>

                          {editingId === task.id ? (
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onBlur={() => handleSaveEdit(task.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEdit(task.id);
                              }}
                            />
                          ) : (
                            <span
                              className={task.completed ? "completed" : ""}
                              onClick={() => {
                                setEditingId(task.id);
                                setEditTitle(task.title);
                              }}
                            >
                              {task.title}
                            </span>
                          )}

                          <button
                            className="delete"
                            onClick={() => handleDelete(task.id)}
                          >
                            <img src="/delete.png" alt="Delete" />
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </>
  );
}

export default App;
