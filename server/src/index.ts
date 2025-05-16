import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const tasks = [
  { id: 1, title: "Learn Git", completed: false, dueDate: "05-20-2025" },
  { id: 2, title: "Do Dishes", completed: false, dueDate: "05-20-2025" },
  { id: 3, title: "Build App", completed: false, dueDate: "05-20-2025" },
];

let nextID = 4;

app.get("/tasks", (req: Request, res: Response) => {
  res.json(tasks);
});

app.post("/tasks", (req: Request, res: Response): void => {
  const { title, dueDate } = req.body;

  if (!title) {
    res.status(400).send("No Title Entered");
    return;
  }

  const newTask = {
    id: nextID++,
    title,
    completed: false,
    dueDate: dueDate || null,
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((task) => task.id === id);

  if (index !== -1) {
    const taskUpdate = tasks[index];
    const { title, completed, dueDate } = req.body;
    if (title !== undefined) {
      taskUpdate.title = title;
    }
    if (completed !== undefined) {
      taskUpdate.completed = completed;
    }
    if (dueDate !== undefined) {
      taskUpdate.dueDate = dueDate;
    }
    res.json(taskUpdate);
  } else {
    res.status(404).send("Task Not Foudn");
  }
});

app.delete("/tasks/:id", (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((task) => task.id === id);

  if (index !== -1) {
    tasks.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send("Task Not Found");
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
