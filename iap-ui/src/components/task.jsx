import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const Task = ({ id, title, description, status, priority, deadline, category, categories, onEdit, onDelete }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedDescription, setEditedDescription] = useState(description);
    const [editedStatus, setEditedStatus] = useState(status);
    const [editedPriority, setEditedPriority] = useState(priority);
    const [editedDeadline, setEditedDeadline] = useState(deadline);
    const [editedCategory, setEditedCategory] = useState(category);

    const handleEdit = () => {
        onEdit(id, editedTitle, editedDescription, editedStatus, editedPriority, editedDeadline, editedCategory);
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
                return 'bg-secondary';
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
        <div className="task-item border rounded p-3 mb-3 d-flex justify-content-between align-items-start shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
            {/* Left Section - Task Info (Horizontally Stacked) */}
            <div className="task-info d-flex align-items-center">
                {/* Associated Category */}
                <span className="badge bg-primary me-3" style={{ fontSize: '1rem', padding: '0.6em 1em', width: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{category}</span>

                {/* Task ID */}
                <span className="text-muted me-3" style={{ fontSize: '1.1rem', fontStyle: 'italic' }}>#{id}</span>

                {/* Task Title */}
                <h5 className="mb-0 fw-bold text-dark" style={{ maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '1.3rem' }}>
                    {title}
                </h5>
            </div>

            {/* Right Section - Task Meta Information */}
            <div className="task-meta d-flex align-items-center">
                {/* Deadline */}
                {deadline && (
                    <div className="deadline d-flex align-items-center me-3">
                        <i className="bi bi-calendar me-2" style={{ color: '#6c757d', fontSize: '1.2rem' }}></i>
                        <span className="text-muted" style={{ fontSize: '1.1rem' }}>
                            Due: <strong>{new Date(deadline).toLocaleString('en-GB')}</strong>
                        </span>
                    </div>
                )}

                {/* Task Status */}
                <span className={`badge ${getStatusClass(status)} me-3`} style={{ fontWeight: '500', fontSize: '1rem', padding: '0.6em 1em', width: '112px', textAlign: 'center' }}>{status}</span>

                {/* Task Priority */}
                {priority !== 'UNDEFINED' && (
                    <span className={`badge ${getPriorityClass(priority)} me-3`} style={{ fontWeight: '500', fontSize: '1rem', padding: '0.6em 1em', width: '152px', textAlign: 'center' }}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                    </span>
                )}

                {/* Trigger Edit Modal */}
                <button
                    className="btn btn-outline-primary btn-sm me-2"
                    style={{ borderRadius: '20px', fontSize: '1rem' }}
                    onClick={() => setShowEditModal(true)}
                >
                    Edit
                </button>

                {/* Trigger Delete Confirmation Modal */}
                <button
                    className="btn btn-outline-danger btn-sm"
                    style={{ borderRadius: '20px', fontSize: '1rem' }}
                    onClick={() => setShowDeleteModal(true)}
                >
                    Remove
                </button>
            </div>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTaskTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTaskDescription" className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTaskStatus" className="mt-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                value={editedStatus}
                                onChange={(e) => setEditedStatus(e.target.value)}
                            >
                                <option value="Completed">Completed</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Idle">Idle</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formTaskPriority" className="mt-3">
                            <Form.Label>Priority</Form.Label>
                            <Form.Select
                                value={editedPriority}
                                onChange={(e) => setEditedPriority(e.target.value)}
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formTaskDeadline" className="mt-3">
                            <Form.Label>Deadline</Form.Label>
                            <Form.Control
                                type="date"
                                value={editedDeadline}
                                onChange={(e) => setEditedDeadline(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTaskCategory" className="mt-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                value={editedCategory}
                                onChange={(e) => setEditedCategory(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.title}>
                                        {cat.title}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleEdit}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

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
