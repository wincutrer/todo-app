import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

app.use(express.json());

const tasks = [
  { id: 1, title: "Make coffee", completed: false, order: 0 },
  { id: 2, title: "Take deep breath", completed: false, order: 1 },
  { id: 3, title: "Build this app", completed: false, order: 2 },
];

let nextID = 4;

app.get("/tasks", (req: Request, res: Response) => {
  const sortedTasks = tasks.slice().sort((a, b) => a.order - b.order);
  res.json(sortedTasks);
});

app.post("/tasks", (req: Request, res: Response): void => {
  const { title } = req.body;

  if (!title || title.trim().length === 0) {
    res.status(400).send("No title entered");
    return;
  }

  if (title.length > 75) {
    res.status(400).send("Title must be 80 characters or fewer");
    return;
  }

  const newTask = {
    id: nextID++,
    title,
    completed: false,
    order: tasks.length, // ← NEW: use length to set order
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/tasks/reorder", (req: Request, res: Response) => {
  console.log("Received reorder:", req.body);
  const newOrder = req.body; // should be array of { id, order }

  newOrder.forEach(({ id, order }: { id: number; order: number }) => {
    const task = tasks.find((t) => t.id === id);
    if (task) task.order = order;
  });

  res.status(200).json({ message: "Order updated" });
});

app.put("/tasks/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((task) => task.id === id);

  if (index !== -1) {
    const taskUpdate = tasks[index];
    const { title, completed } = req.body;

    if (title !== undefined) {
      if (title.trim().length === 0) {
        res.status(400).send("Title cannot be empty");
        return;
      }
      if (title.length > 75) {
        res.status(400).send("Title must be 80 characters or fewer");
        return;
      }
      taskUpdate.title = title;
    }

    if (completed !== undefined) {
      taskUpdate.completed = completed;
    }

    res.json(taskUpdate);
  } else {
    res.status(404).send("Task Not Found");
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
