import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get('/api/tasks');
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <div>Loading...</div>;

  const pending = tasks.filter(t => t.status === 'Pending').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  
  // Quick overdue calculation
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed').length;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2>Dashboard</h2>
        <span className="text-muted">Welcome back, {user.name}</span>
      </div>

      <div className="grid grid-3 mb-4">
        <div className="card stat-card">
          <div className="stat-value">{tasks.length}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{color: 'var(--success)'}}>{completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{color: 'var(--danger)'}}>{overdue}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 className="mb-3">Recent Tasks</h3>
          {tasks.slice(0, 5).map(task => (
            <div key={task._id} className="flex justify-between items-center mb-3" style={{padding: '1rem', background: 'var(--glass-bg)', borderRadius: '8px'}}>
              <div>
                <h4 className="mb-1">{task.title}</h4>
                <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                  Project: {task.projectId?.name || 'N/A'} • Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                </div>
              </div>
              <span className={`badge badge-${task.status === 'Completed' ? 'completed' : task.status === 'Pending' ? 'pending' : 'progress'}`}>
                {task.status}
              </span>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-muted">No tasks assigned yet.</p>}
        </div>
        <div className="card">
          <h3 className="mb-3">Quick Actions</h3>
          <div className="grid" style={{gap: '1rem'}}>
            <Link to="/projects" className="btn btn-outline" style={{justifyContent: 'flex-start', padding: '1rem'}}>
              📁 View All Projects
            </Link>
            {user.role === 'Admin' && (
               <Link to="/projects" className="btn btn-primary" style={{justifyContent: 'flex-start', padding: '1rem'}}>
                 ➕ Create New Project
               </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
