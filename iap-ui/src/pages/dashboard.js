import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/navbar';
import { API_URL } from '../../api_url';
import Task from '@/components/task';
import Category from '@/components/category';

const Dashboard = () => {
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

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = sessionStorage.getItem('sessionToken');
                const response = await fetch(`${API_URL}/tasks`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                console.log('Tasks:', data.content);
                setTasks(data.content);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

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


    const handleAddTask = () => {
        const newTask = {
            id: tasks.length + 1,
            category: 'Default',
            title: `New Task ${tasks.length + 1}`,
            status: 'Idle',
            priority: 'low',
            deadline: '2023-12-31',
        };
        setTasks([...tasks, newTask]);
    };

    return (
        <main>
            <Navbar />
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
                                </div>
                            </div>
                            <button className="btn btn-primary mt-2 align-self-end" onClick={handleAddTask}>
                                <span className="me-2">+</span>New Task
                            </button>
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
                            <button className="btn btn-primary mt-2 align-self-end" onClick={handleAddCategory}>
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
