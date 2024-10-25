import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const Category = ({ title, description, onEdit, onDelete }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedDescription, setEditedDescription] = useState(description);
    const [deleteTasks, setDeleteTasks] = useState(false); // Track whether to delete related tasks

    const handleEdit = () => {
        onEdit(editedTitle, editedDescription); // Pass updated data back to parent
        setShowEditModal(false); // Close modal after saving
    };

    const handleDelete = () => {
        onDelete(deleteTasks); // Pass deleteTasks option to parent
        setShowDeleteModal(false); // Close modal after confirming deletion
    };

    return (
        <div className="category-item border rounded p-3 mb-3 d-flex justify-content-between align-items-start shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
            {/* Category Info */}
            <div className="category-info d-flex align-items-center">
                <h5 className="mb-0 fw-bold text-dark" style={{ maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '1.3rem' }}>
                    {title}
                </h5>
            </div>

            {/* Edit and Remove Buttons */}
            <div className="category-actions d-flex align-items-center">
                <button className="btn btn-outline-primary btn-sm me-2" style={{ borderRadius: '20px', fontSize: '1rem' }} onClick={() => setShowEditModal(true)}>Edit</button>
                <button className="btn btn-outline-danger btn-sm" style={{ borderRadius: '20px', fontSize: '1rem' }} onClick={() => setShowDeleteModal(true)}>Delete</button>
            </div>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formCategoryTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCategoryDescription" className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

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