import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const TaskModal = ({ show, onClose, onSave, initialData, categories, isEditMode = false }) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [completionStatus, setCompletionStatus] = useState(initialData.completionStatus || 'IDLE');
    const [priority, setPriority] = useState(initialData.priority || 'UNDEFINED');
    const [deadline, setDeadline] = useState(initialData.deadline || '');
    const [category, setCategory] = useState(initialData.category || null);

    // Update the modal fields when initialData changes (e.g., switching between tasks)
    useEffect(() => {
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setCompletionStatus(initialData.completionStatus || 'IDLE');
        setPriority(initialData.priority || 'UNDEFINED');
        setDeadline(initialData.deadline || '');
        setCategory(initialData.category || null);
    }, [initialData]);

    const handleSave = () => {
        onSave({
            id: initialData.id,
            title,
            description,
            completionStatus,
            priority,
            deadline,
            category,
        });
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header className="py-2" closeButton>
                <Modal.Title>{isEditMode ? 'Edit Task' : 'Create Task'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formTaskTitle">
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
                    <Form.Group controlId="formTaskDescription" className="mt-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={1} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formTaskCompletionStatus" className="mt-3">
                        <Form.Label>Completion Status</Form.Label>
                        <Form.Select value={completionStatus} onChange={(e) => setCompletionStatus(e.target.value)}>
                            <option value="IDLE">Idle</option>
                            <option value="ONGOING">Ongoing</option>
                            <option value="COMPLETED">Completed</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="formTaskPriority" className="mt-3">
                        <Form.Label>Priority</Form.Label>
                        <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="UNDEFINED"></option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="formTaskDeadline" className="mt-3">
                        <Form.Label>Deadline</Form.Label>
                        <Form.Control type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formTaskCategory" className="mt-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            value={category?.id || ''}
                            onChange={(e) => {
                                const selectedCategory = categories.find((cat) => cat.id === Number(e.target.value));
                                setCategory(selectedCategory || {});
                            }}
                        >
                            <option value=""></option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.title}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={title.length <= 3}
                >
                    {isEditMode ? 'Save Changes' : 'Create Task'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TaskModal;
