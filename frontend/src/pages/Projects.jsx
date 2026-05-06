import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('/api/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/projects', { name, description });
      setName('');
      setDescription('');
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2>Projects</h2>
      </div>

      <div className="grid grid-2">
        <div className="projects-list" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {projects.map(project => (
            <div key={project._id} className="card">
              <h3 className="mb-1">{project.name}</h3>
              <p className="text-muted mb-3">{project.description}</p>
              <div className="flex justify-between items-center">
                <span className="badge" style={{background: 'rgba(255,255,255,0.1)'}}>
                  Manager: {project.adminId?.name || 'Unknown'}
                </span>
                <Link to={`/projects/${project._id}`} className="btn btn-outline" style={{padding: '0.4rem 0.8rem'}}>
                  View Tasks &rarr;
                </Link>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="text-muted">No projects found.</p>}
        </div>

        {user.role === 'Admin' && (
          <div>
            <div className="card" style={{position: 'sticky', top: '100px'}}>
              <h3 className="mb-3">Create New Project</h3>
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label className="form-label">Project Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    rows="3"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
                  Create Project
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
