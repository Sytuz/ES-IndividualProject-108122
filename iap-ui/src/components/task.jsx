import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import TaskModal from './TaskModal';

const Task = ({ id, title, description, status, priority, deadline, category, categories, onEdit, onDelete }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleEdit = (editedData) => {
        onEdit(id, editedData.title, editedData.description, editedData.status, editedData.priority, editedData.deadline, editedData.category);
        setShowEditModal(false);
    };

    const handleDelete = () => {
        onDelete(id);
        setShowDeleteModal(false);
    };

    const getPriorityClass = (priority) => {
        if (!priority) {
            return;
        }
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-danger';
            case 'medium':
                return 'bg-warning';
            case 'low':
                return 'bg-success';
            default:
                return 'tt-bg-secondary';
        }
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-success';
            case 'ongoing':
                return 'bg-info';
            case 'idle':
                return 'bg-secondary';
            default:
                return 'bg-secondary';
        }
    };

    return (
        <div className="task-item border rounded p-3 mb-3 d-flex justify-content-between align-items-center shadow-sm" style={{ backgroundColor: '#f8f9fa', height: '55px' }}>
            {/* Left Section - Task Info (Horizontally Stacked) */}
            <div className="task-info d-flex align-items-center">
                {/* Priority Indicator */}
                <div className={`${getPriorityClass(priority)}`} style={{ display: 'inline-block', width: '10px', height: '55px', borderRadius: '0', marginRight: '15px' }}></div>

                {/* Task Title and Category */}
                <div className="d-flex flex-column">
                    <h5 className="fw-bold text-dark mb-0" style={{ maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {title}
                    </h5>
                    <span className="text-muted" style={{ padding: '0.4em 0.8em', fontSize: '12px', fontStyle: 'italic', paddingTop: '2px', paddingBottom: '0px' }}>{category}</span>
                </div>
            </div>


            {/* Right Section - Task Meta Information */}
            <div className="task-meta d-flex align-items-center">
                {/* Deadline */}
                {deadline && (
                    <div className="deadline d-flex align-items-center me-3">
                        <i className="bi bi-calendar me-2" style={{ color: '#6c757d' }}></i>
                        <span className="text-muted">
                            Due: <strong>{new Date(deadline).toLocaleString('en-GB')}</strong>
                        </span>
                    </div>
                )}

                {/* Task Status */}
                <span className={`badge ${getStatusClass(status)} me-3`} style={{ fontWeight: '500', padding: '0.6em 1em', width: '112px', textAlign: 'center' }}>{status}</span>

                {/* Trigger Edit Modal */}
                <button
                    className="btn btn-outline-primary btn-sm me-2"
                    style={{ borderRadius: '20px' }}
                    onClick={() => setShowEditModal(true)}
                >
                    Edit
                </button>

                {/* Trigger Delete Confirmation Modal */}
                <button
                    className="btn btn-outline-danger btn-sm"
                    style={{ borderRadius: '20px' }}
                    onClick={() => setShowDeleteModal(true)}
                >
                    Delete
                </button>
            </div>

            {/* TaskModal for Editing */}
            <TaskModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={handleEdit}
                initialData={{ title, description, status, priority, deadline, category }}
                categories={categories}
                isEditMode={true}
            />

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this task?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Task;
