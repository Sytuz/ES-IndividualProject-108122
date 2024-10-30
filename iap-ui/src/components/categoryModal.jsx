// src/components/CategoryModal.js

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CategoryModal = ({ show, onClose, onSave, initialData = {} }) => {
    const [id, setId] = useState(initialData.id || null);
    const [title, setTitle] = useState(initialData.title || '');
    const [description, setDescription] = useState(initialData.description || '');

    const handleSave = () => {
        onSave({ id, title, description });
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{initialData ? 'Edit Category' : 'Create Category'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formCategoryTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            isInvalid={title.length <= 3}
                            />
                        <Form.Control.Feedback type="invalid">
                            Title must be longer than 3 characters.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formCategoryDescription" className="mt-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CategoryModal;
