import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useParams, Link } from 'react-router-dom';

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState('');
  const { user } = useContext(AuthContext);

  const fetchDetails = async () => {
    try {
      const [projRes, taskRes, usersRes] = await Promise.all([
        axios.get(`/api/projects/${id}`),
        axios.get(`/api/tasks/project/${id}`),
        axios.get(`/api/auth/users`)
      ]);
      setProject(projRes.data);
      setTasks(taskRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Failed to fetch details', error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', { title, description, projectId: id, dueDate, assignedTo: assignedTo || null });
      setTitle('');
      setDescription('');
      setDueDate('');
      setAssignedTo('');
      fetchDetails();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      fetchDetails();
    } catch (error) {
      console.error('Failed to update status', error);
      alert(error.response?.data?.message || 'Failed to update');
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <Link to="/projects" className="btn btn-outline mb-3" style={{padding: '0.3rem 0.6rem'}}>
          &larr; Back to Projects
        </Link>
        <h2>{project.name}</h2>
        <p className="text-muted">{project.description}</p>
      </div>

      <div className="grid grid-2">
        <div className="tasks-list" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <h3 className="mb-2">Tasks ({tasks.length})</h3>
          {tasks.map(task => (
            <div key={task._id} className="card" style={{padding: '1rem'}}>
              <div className="flex justify-between items-start mb-2">
                <h4 style={{fontSize: '1.1rem'}}>{task.title}</h4>
                <select 
                  className={`badge badge-${task.status === 'Completed' ? 'completed' : task.status === 'Pending' ? 'pending' : 'progress'}`}
                  style={{border: 'none', outline: 'none', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', paddingRight: '1rem'}}
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  disabled={user.role !== 'Admin' && (!task.assignedTo || task.assignedTo._id !== user._id)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <p className="text-muted mb-3" style={{fontSize: '0.9rem'}}>{task.description}</p>
              <div className="flex justify-between items-center" style={{fontSize: '0.85rem'}}>
                <span style={{color: 'var(--primary)'}}>
                  Assigned to: {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                </span>
                <span className="text-muted">
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}
                </span>
              </div>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-muted">No tasks in this project.</p>}
        </div>

        {user.role === 'Admin' && (
          <div>
            <div className="card" style={{position: 'sticky', top: '100px'}}>
              <h3 className="mb-3">Add Task</h3>
              <form onSubmit={handleCreateTask}>
                <div className="form-group">
                  <label className="form-label">Task Title</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    rows="2"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Assign To</label>
                  <select 
                    className="form-control" 
                    value={assignedTo} 
                    onChange={(e) => setAssignedTo(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
                  Add Task
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;
