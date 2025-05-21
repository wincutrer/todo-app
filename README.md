# ToDo App

A clean, responsive, and interactive ToDo application built with React and TypeScript. This project showcases core full-stack development skills including drag-and-drop functionality, editable tasks, dark mode, server-side data persistence, and deployment to Vercel and Render.

## Features

- Add, edit, complete, and delete tasks
- Drag-and-drop to reorder tasks
- Light and dark mode toggle
- Auto-focus and keyboard support for editing
- Character limit enforcement (75 characters max)
- Mobile-friendly layout with responsive design
- Persistent backend data (in-memory, via Express.js API)
- Environment variable support for flexible API endpoints

## What I Learned

- Managing and structuring a full-stack project using React and Express
- Creating and consuming REST APIs with TypeScript
- Implementing drag-and-drop with `@hello-pangea/dnd`
- Building dark mode and mobile-first responsive UI with CSS
- Managing UI state (editing, form submission, etc.) with React hooks
- Persisting frontend changes to the backend using `fetch` and async flows
- Using environment variables in React and Express
- Deploying full-stack apps with Vercel (frontend) and Render (backend)
- Debugging CORS issues and understanding deployment pipelines

## Tech Stack

**Frontend:**
- React
- TypeScript
- @hello-pangea/dnd
- Vanilla CSS

**Backend:**
- Express (Node.js)
- TypeScript

**Deployment:**
- Frontend hosted on [Vercel](https://vercel.com)
- Backend hosted on [Render](https://render.com)

## Live Demo

- Frontend: [https://todo-app-eight-ivory-83.vercel.app](https://todo-app-eight-ivory-83.vercel.app)

## Backend

This project uses a custom Express.js server with in-memory storage and a `/tasks` REST API. The backend handles:

- Creating, updating, deleting, and reordering tasks
- Enforcing character limits and validation
- CORS configuration for secure frontend communication

The backend is deployed on [Render](https://render.com) and communicates with the frontend using environment variables.
