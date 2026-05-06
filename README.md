# Team Task Manager

A full-stack web application where users can create projects, assign tasks, and track progress with role-based access control (Admin/Member). 

## 🚀 Features
- **Authentication**: JWT-based Signup/Login.
- **Roles**: Admin (can create projects and assign tasks), Member (can update task status).
- **Dashboard**: View overall progress, completed, and overdue tasks.
- **Dynamic UI**: Rich Vanilla CSS styling with glassmorphism, dark mode aesthetics, and micro-animations.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), React Router, Axios, Vanilla CSS.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT.

## 💻 Running Locally

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure the `.env` file exists in `backend/` with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
   *(By default, it falls back to a local mongodb instance and a fallback secret for easy local testing)*.
4. Run the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure the `.env` file exists in `frontend/` with the API URL:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## 🌐 Deploying to Railway

Railway makes it extremely easy to deploy full-stack applications.

### Option A: Monorepo Deployment (Recommended)
1. Push this entire repository (including `frontend` and `backend` folders) to GitHub.
2. Go to [Railway.app](https://railway.app/) and create a new project -> **Deploy from GitHub repo**.
3. Select this repository.
4. Railway will automatically detect the folders. If not, go to the service settings and set the **Root Directory** to `/backend`.
5. Under Variables for the backend service, add:
   - `MONGO_URI` (You can provision a MongoDB service directly in Railway or use MongoDB Atlas)
   - `JWT_SECRET`
   - `PORT` (Railway automatically assigns a port, but setting it doesn't hurt)
6. For the frontend:
   - Create a second service from the same repo.
   - Set the **Root Directory** to `/frontend`.
   - Railway will build the Vite app.
   - Under Variables, add `VITE_API_URL` and set it to the public domain of your backend service.

### Option B: Deploying separately
If you prefer, you can initialize separate Git repositories inside the `backend` and `frontend` folders and deploy them as separate projects on Railway.

## 📦 Submission
- **Live URL**: [Replace with your Railway URL]
- **GitHub Repo**: [Replace with your Repo URL]
