import React from 'react';

const statusColors = {
  Applied: 'secondary',
  OA: 'info',
  Interview: 'warning',
  Offer: 'success',
  Rejected: 'danger',
};

function ApplicationCard({ application, onEdit, onDelete }) {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-1">{application.role}</h5>
            <h6 className="card-subtitle text-muted mb-2">{application.company}</h6>
          </div>
          <span className={`badge bg-${statusColors[application.status] || 'secondary'}`}>
            {application.status}
          </span>
        </div>

        {application.notes && <p className="card-text mt-2">{application.notes}</p>}

        {application.link && (
          <a href={application.link} target="_blank" rel="noreferrer" className="d-block mb-2">
            View job posting
          </a>
        )}

        <small className="text-muted d-block mb-2">
          Applied: {new Date(application.appliedDate).toLocaleDateString()}
        </small>

        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(application)}>
            Edit
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(application._id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicationCard;