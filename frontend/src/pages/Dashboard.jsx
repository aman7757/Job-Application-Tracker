
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import ApplicationCard from '../components/ApplicationCard.jsx';
import ApplicationForm from '../components/ApplicationForm.jsx';

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null); // null = adding new, object = editing existing
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  // Fetch applications whenever the filter changes (or on first load)
  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      const query = statusFilter ? `?status=${statusFilter}` : '';
      const response = await api.get(`/applications${query}`);
      setApplications(response.data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    }
  };

  const handleAddClick = () => {
    setEditingApp(null);
    setShowForm(true);
  };

  const handleEditClick = (application) => {
    setEditingApp(application);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingApp) {
        // Editing an existing one
        await api.put(`/applications/${editingApp._id}`, formData);
      } else {
        // Adding a new one
        await api.post('/applications', formData);
      }
      setShowForm(false);
      fetchApplications(); // refresh the list
    } catch (err) {
      console.error('Failed to save application', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      fetchApplications();
    } catch (err) {
      console.error('Failed to delete application', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Simple stats calculated from the current list
  const stats = {
    total: applications.length,
    interviews: applications.filter((a) => a.status === 'Interview').length,
    offers: applications.filter((a) => a.status === 'Offer').length,
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Job Application Tracker</h2>
        <button className="btn btn-outline-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Stats row */}
      <div className="row mb-4">
        <div className="col-4">
          <div className="card text-center p-3">
            <h4>{stats.total}</h4>
            <small className="text-muted">Total Applied</small>
          </div>
        </div>
        <div className="col-4">
          <div className="card text-center p-3">
            <h4>{stats.interviews}</h4>
            <small className="text-muted">Interviews</small>
          </div>
        </div>
        <div className="col-4">
          <div className="card text-center p-3">
            <h4>{stats.offers}</h4>
            <small className="text-muted">Offers</small>
          </div>
        </div>
      </div>

      {/* Filter + Add button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <select
          className="form-select"
          style={{ width: '200px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="OA">OA</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button className="btn btn-primary" onClick={handleAddClick}>
          + Add Application
        </button>
      </div>

      {/* Applications list */}
      {applications.length === 0 ? (
        <p className="text-muted">No applications yet. Click "Add Application" to get started.</p>
      ) : (
        applications.map((app) => (
          <ApplicationCard
            key={app._id}
            application={app}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        ))
      )}

      {/* Add/Edit modal, only shown when needed */}
      {showForm && (
        <ApplicationForm
          initialData={editingApp}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;