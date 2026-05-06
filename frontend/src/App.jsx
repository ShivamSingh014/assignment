import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            TaskFlow
          </Link>
          <div className="nav-links">
            {user ? (
              <>
                <Link to="/" className="btn btn-outline">Dashboard</Link>
                <Link to="/projects" className="btn btn-outline">Projects</Link>
                <span style={{color: 'var(--text-muted)'}}>| {user.name} ({user.role})</span>
                <button onClick={logout} className="btn btn-danger">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container main-content">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/projects" element={user ? <Projects /> : <Navigate to="/login" />} />
          <Route path="/projects/:id" element={user ? <ProjectDetails /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
