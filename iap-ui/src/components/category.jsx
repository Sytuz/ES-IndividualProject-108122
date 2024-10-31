// src/components/Category.js

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import CategoryModal from './CategoryModal'; // Import the new modal

const Category = ({ id, title, description, onEdit, onDelete }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTasks, setDeleteTasks] = useState(false); // Track whether to delete related tasks

    const handleEdit = (editedData) => {
        onEdit(editedData);
        setShowEditModal(false); // Close modal after saving
    };

    const handleDelete = () => {
        onDelete({id, deleteTasks}); 
        setShowDeleteModal(false); // Close modal after confirming deletion
    };

    return (
        <div className="category-item border rounded p-3 mb-3 d-flex justify-content-between align-items-center shadow-sm" style={{ backgroundColor: '#f8f9fa', height: '55px' }}>
            {/* Category Info */}
            <div className="category-info d-flex align-items-center">
                <h5 className="mb-0 fw-bold text-dark" style={{ maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '1.3rem' }}>
                    {title}
                </h5>
            </div>

            {/* Edit and Remove Buttons */}
            <div className="category-actions d-flex align-items-center">
                <button className="btn btn-outline-primary btn-sm me-2" style={{ borderRadius: '20px'}} onClick={() => setShowEditModal(true)}>Edit</button>
                <button className="btn btn-outline-danger btn-sm" style={{ borderRadius: '20px'}} onClick={() => setShowDeleteModal(true)}>Delete</button>
            </div>

            {/* Edit Modal */}
            <CategoryModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={handleEdit}
                initialData={{ id, title, description }} // Pass initial data for editing
            />

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this category?</p>
                    <Form.Check 
                        type="checkbox"
                        label="Delete all tasks related to this category"
                        checked={deleteTasks}
                        onChange={(e) => setDeleteTasks(e.target.checked)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Category;
