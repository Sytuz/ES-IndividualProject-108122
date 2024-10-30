import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/navbar';
import Task from '@/components/task';
import Category from '@/components/category';
import { useRouter } from 'next/router';
import { API_URL } from '../../api_url';
import TaskModal from '@/components/TaskModal';

const Dashboard = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');

    const [showCreateModal, setShowCreateModal] = useState(false);

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

    const [categories, setCategories] = useState([
        { id: 1, title: 'Default', description: 'General tasks' },
        { id: 2, title: 'Work', description: 'Work-related tasks' },
        { id: 3, title: 'Personal', description: 'Personal tasks and goals' },
    ]);

    const [tasks, setTasks] = useState([]);

    // Function to fetch tasks from the API
    const fetchTasks = async (page = 0, size = 6, sort = 'id,desc') => {
        const sessionToken = sessionStorage.getItem('sessionToken');
        try {
            const response = await fetch(`${API_URL}/tasks?page=${page}&size=${size}&sort=${sort}`, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            const data = await response.json();
            console.log('Tasks:', data.content);
            setTasks(data.content || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    };

    // Fetch all tasks from the API on component mount
    useEffect(() => {
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

    const handleAddCategory = () => {
        const newCategory = {
            id: categories.length + 1,
            title: `New Category ${categories.length + 1}`,
            description: 'Description for new category',
        };
        setCategories([...categories, newCategory]);
    };

    const handleEditTask = (id, updatedTitle, updatedDescription, updatedStatus, updatedPriority, updatedDeadline, updatedCategory) => {
        setTasks(tasks.map(task =>
            task.id === id
                ? { ...task, title: updatedTitle, description: updatedDescription, status: updatedStatus, priority: updatedPriority, deadline: updatedDeadline, category: updatedCategory }
                : task
        ));
    };

    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

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
        setShowCreateModal(false);
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
                                            categories={categories}  // Pass the categories prop
                                            onEdit={handleEditTask}
                                            onDelete={handleDeleteTask}
                                        />
                                    ))}
                                    {/* Center the Load More button */}
                                    <div className="d-flex justify-content-center mt-2">
                                        <button className="btn btn-outline-tt-color" onClick={() => fetchTasks(0, tasks.length + 6)} style={{height: '35px'}}>
                                            <span className="me-2">&#x25BC;</span>Load More
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button className="btn text-white tt-bgcolor mt-2 align-self-end" onClick={() => setShowCreateModal(true)}>
                                <span className="me-2">+</span>New Task
                            </button>
                            <TaskModal
                                show={showCreateModal}
                                onClose={() => setShowCreateModal(false)}
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
                                            key={category.id}
                                            title={category.title}
                                            description={category.description}
                                            onEdit={(newTitle, newDescription) => handleEditCategory(category.id, newTitle, newDescription)}
                                            onDelete={(deleteTasks) => handleDeleteCategory(category.id, deleteTasks)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button className="btn text-white tt-bgcolor mt-2 align-self-end" onClick={handleAddCategory}>
                                <span className="me-2">+</span>New Category
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;