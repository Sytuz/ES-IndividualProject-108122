import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CategoryModal = ({ show, onClose, onSave, initialData = {}, isEditMode = false }) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [description, setDescription] = useState(initialData.description || '');

    // Update modal state when initialData changes (reset fields)
    useEffect(() => {
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
    }, [initialData]);

    const handleSave = () => {
        onSave({ id: initialData.id || null, title, description });
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header className="py-2" closeButton>
                <Modal.Title>{isEditMode ? 'Edit Category' : 'Create Category'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={(e) => {
                        e.preventDefault(); // Prevent page refresh
                        handleSave(); // Trigger save functionality
                    }}>
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
                <Button variant="primary" onClick={handleSave} disabled={title.length <= 3}>
                    {isEditMode ? 'Save Changes' : 'Create Category'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CategoryModal;