import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/navbar';
import Task from '@/components/task';
import Category from '@/components/category';
import { useRouter } from 'next/router';
import { API_URL } from '../../api_url';
import TaskModal from '@/components/TaskModal';
import CategoryModal from '@/components/CategoryModal';

const Dashboard = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');

    const [showTaskCreateModal, setShowTaskCreateModal] = useState(false);
    const [showCategoryCreateModal, setShowCategoryCreateModal] = useState(false);

    // Get the username from the session token, to put on navbar
    useEffect(() => {
        const sessionToken = sessionStorage.getItem('sessionToken');
        const fetchUsername = async () => {
            try {
                const response = await fetch(`${API_URL}/users/username`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                    },
                });

                if (response.ok) {
                    const username = await response.text(); // Directly parse the plain text response
                    setUsername(username);
                } else {
                    console.error('Failed to fetch username');
                    router.push('/login'); // Redirect to login if not authorized
                }
            } catch (error) {
                console.error('Error fetching username:', error);
                router.push('/login'); // Redirect on error
            }
        };

        if (sessionToken) {
            fetchUsername();
        } else {
            router.push('/login');
        }
    }, []);

    // Make the body a little darker
    useEffect(() => {
        document.body.classList.add('darkbg');
        return () => {
            document.body.classList.remove('darkbg');
        };
    }, []);

    const emptyTask = { id: 0, category: '', title: '', status: '', priority: '', deadline: '' };
    const [taskToEdit, setTaskToEdit] = useState(emptyTask);

    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);

    // Function to fetch tasks from the API
    const fetchTasks = async (page = 0, size = 6, sort = 'id,desc') => {
        const sessionToken = sessionStorage.getItem('sessionToken');
        try {
            const response = await fetch(`${API_URL}/tasks?page=${page}&size=${size}&sort=${sort}`, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Tasks:', data.content);
                setTasks(data.content || []);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    };

    // Function to fetch categories from the API
    const fetchCategories = async () => {
        const sessionToken = sessionStorage.getItem('sessionToken');
        try {
            const response = await fetch(`${API_URL}/categories?sort=id,desc`, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Categories:', data.content);
                setCategories(data.content || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    };

    // Fetch all tasks from the API on component mount
    useEffect(() => {
        fetchCategories();
        fetchTasks();
    }, []);

    const handleEditCategory = (id, newTitle, newDescription) => {
        // Find the old title of the category being edited
        const oldCategory = categories.find(category => category.id === id).title;

        // Update categories
        setCategories(categories.map(category =>
            category.id === id
                ? { ...category, title: newTitle, description: newDescription }
                : category
        ));

        // Update tasks that are associated with the old category title
        setTasks(tasks.map(task =>
            task.category === oldCategory
                ? { ...task, category: newTitle } // Change to new title
                : task
        ));
    };

    const handleDeleteCategory = (id, deleteTasks) => {
        setCategories(categories.filter(category => category.id !== id));
        if (deleteTasks) {
            setTasks(tasks.filter(task => task.category !== categories.find(category => category.id === id).title));
        }
    };

    {/* Function to create a category */ }
    const onCreateCategory = async (newCategoryData) => {
        const sessionToken = sessionStorage.getItem('sessionToken');
        try {
            const response = await fetch(`${API_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                },
                body: JSON.stringify(newCategoryData)
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Category created:', data);
                alert('Category created successfully!');
                fetchCategories(); // Fetch categories again to update the list
            } else {
                // If the response code is 400, warn the user about invalid input
                if (response.status === 400) {
                    console.error('Invalid input for category creation');
                    alert('Invalid input for category creation');
                }
                else if (response.status === 403) {
                    console.error('Unauthorized to create category');
                    router.push('/login'); // Redirect to login if not authorized
                }
                console.error('Failed to create category');
            }
        } catch (error) {
            console.error('Error creating category:', error);
        }
    }

    const handleCreateCategory = (newCategoryData) => {
        onCreateCategory(newCategoryData);
        setShowCategoryCreateModal(false);
    };

    {/* Function to edit a task */ }
    const onEditTask = async (editedTaskData) => {
        const sessionToken = sessionStorage.getItem('sessionToken');
        console.log('Edited task data:', editedTaskData);
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                },
                body: JSON.stringify(editedTaskData)
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Task edited:', data);
                alert('Task edited successfully!');
                fetchTasks(); // Fetch tasks again to update the list
            } else {
                // If the response code is 400, warn the user about invalid input
                if (response.status === 400) {
                    console.error('Invalid input for task edition');
                    alert('Invalid input for task edition');
                }
                else if (response.status === 403) {
                    console.error('Unauthorized to edit task');
                    router.push('/login'); // Redirect to login if not authorized
                }
                console.error('Failed to edit task');
            }
        } catch (error) {
            console.error('Error editing task:', error);
        }

    };

    {/* Function to delete a task */ }
    const onDeleteTask = async (id) => {
        const sessionToken = sessionStorage.getItem('sessionToken');
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                },
                body: id
            });
            if (response.ok) {
                console.log('Task deleted: ', id);
                alert('Task deleted successfully!');
                fetchTasks(); // Fetch tasks again to update the list
            } else {
                // If the response code is 400, warn the user about invalid input
                if (response.status === 400) {
                    console.error('Invalid input for task deletion');
                    alert('Invalid input for task deletion');
                }
                else if (response.status === 403) {
                    console.error('Unauthorized to delete task');
                    router.push('/login'); // Redirect to login if not authorized
                }
                console.error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error delete task:', error);
        }

    };

    {/* Function to create a task */ }
    const onCreateTask = async (newTaskData) => {
        const sessionToken = sessionStorage.getItem('sessionToken');
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                },
                body: JSON.stringify(newTaskData)
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Task created:', data);
                alert('Task created successfully!');
                fetchTasks(); // Fetch tasks again to update the list
            } else {
                // If the response code is 400, warn the user about invalid input
                if (response.status === 400) {
                    console.error('Invalid input for task creation');
                    alert('Invalid input for task creation');
                }
                else if (response.status === 403) {
                    console.error('Unauthorized to create task');
                    router.push('/login'); // Redirect to login if not authorized
                }
                console.error('Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    }

    const handleCreateTask = (newTaskData) => {
        if (newTaskData.category === '') {
            newTaskData.category = null;
        }
        onCreateTask(newTaskData);
        setShowTaskCreateModal(false);
    };

    return (
        <main>
            <Navbar
                username={username} />
            <Head>
                <title>TaskTracker | Dashboard</title>
                <meta name="description" content="Task tracker application" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Main Wrapper - adjusts height minus navbar */}
            <div className="d-flex flex-column" style={{ height: 'calc(95vh - 100px)', marginTop: '100px' }}>
                <div className="container-fluid flex-grow-1 d-flex flex-column">
                    <div className="row flex-grow-1" style={{ height: '100%' }}>
                        {/* Tasks Section */}
                        <div className="col-md-9 h-100 d-flex flex-column">
                            <div className="card flex-grow-1">
                                <div className="card-header text-center">
                                    <h4>Tasks</h4>
                                </div>
                                <div className="card-body overflow-auto" style={{ maxHeight: '70vh' }}>
                                    {tasks.map(task => (
                                        <Task
                                            key={task.id}
                                            category={task.category}
                                            id={task.id}
                                            title={task.title}
                                            status={task.completionStatus}
                                            priority={task.priority}
                                            deadline={task.deadline}
                                            description={task.description}
                                            categories={categories}
                                            onEdit={onEditTask}
                                            onDelete={onDeleteTask}
                                        />
                                    ))}
                                    {/* Center the Load More button */}
                                    <div className="d-flex justify-content-center mt-2">
                                        <button className="btn btn-outline-tt-color" onClick={() => fetchTasks(0, tasks.length + 12)} style={{ height: '35px' }}>
                                            <span className="me-2">&#x25BC;</span>Load More
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button className="btn text-white tt-bgcolor mt-2 align-self-end" onClick={() => setShowTaskCreateModal(true)}>
                                <span className="me-2">+</span>New Task
                            </button>
                            <TaskModal
                                show={showTaskCreateModal}
                                onClose={() => setShowTaskCreateModal(false)}
                                onSave={handleCreateTask}
                                categories={categories}
                            />

                        </div>
                        {/* Categories Section */}
                        <div className="col-md-3 h-100 d-flex flex-column">
                            <div className="card flex-grow-1">
                                <div className="card-header text-center">
                                    <h4>Categories</h4>
                                </div>
                                <div className="card-body overflow-auto" style={{ maxHeight: '70vh' }}>
                                    {categories.map(category => (
                                        <Category
                                            id={category.id}
                                            title={category.title}
                                            description={category.description}
                                            onEdit={(newTitle, newDescription) => handleEditCategory(category.id, newTitle, newDescription)}
                                            onDelete={(deleteTasks) => handleDeleteCategory(category.id, deleteTasks)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button className="btn text-white tt-bgcolor mt-2 align-self-end" onClick={() => setShowCategoryCreateModal(true)}>
                                <span className="me-2">+</span>New Category
                            </button>
                            <CategoryModal
                                show={showCategoryCreateModal}
                                onClose={() => setShowCategoryCreateModal(false)}
                                onSave={handleCreateCategory}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
