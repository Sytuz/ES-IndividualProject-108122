import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/navbar';
import Task from '@/components/task';
import Category from '@/components/category';
import { useRouter } from 'next/router';
import { API_URL } from '../../api_url';
import TaskModal from '@/components/TaskModal';
import CategoryModal from '@/components/CategoryModal';
import Cookies from 'js-cookie';  // Import js-cookie
import { jwtDecode } from "jwt-decode";
import Toasts from '@/components/toasts';

const Dashboard = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [showTaskCreateModal, setShowTaskCreateModal] = useState(false);
    const [showCategoryCreateModal, setShowCategoryCreateModal] = useState(false);

    const [sortOption, setSortOption] = useState('id,desc');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterCategoryTitle, setFilterCategoryTitle] = useState('All');

    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);

    const [taskData, setTaskData] = useState({
        id: null,
        title: '',
        description: '',
        completionStatus: 'IDLE',
        priority: 'UNDEFINED',
        deadline: '',
        category: null,
    });

    const handleNewTask = () => {
        setTaskData({
            id: null,
            title: '',
            description: '',
            completionStatus: 'IDLE',
            priority: 'UNDEFINED',
            deadline: '',
            category: null,
        });
        console.log('reset task data:', taskData);
        setShowTaskCreateModal(true);
    };

    const [categoryData, setCategoryData] = useState({
        id: null,
        title: '',
        description: '',
    });

    const handleNewCategory = () => {
        setCategoryData({
            id: null,
            title: '',
            description: '',
        });
        setShowCategoryCreateModal(true);
    };

    const [toasts, setToasts] = useState([]);

    const addToast = (message, type) => {
        const id = Date.now(); // Unique ID for each toast
        setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
        setTimeout(() => setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id)), 5000);
    };

    const sortOptionToText = {
        'id,desc': 'None',
        'priority,desc': 'Priority',
        'deadline,desc': 'Deadline',
        'creationDate,desc': 'Creation Date',
        'completionStatus,desc': 'Completion Status',
    };

    const filterStatusToText = {
        '': 'None',
        'IDLE': 'Idle',
        'ONGOING': 'Ongoing',
        'COMPLETED': 'Completed',
    };

    // Make the body a little darker
    useEffect(() => {
        document.body.classList.add('darkbg');
        return () => {
            document.body.classList.remove('darkbg');
        };
    }, []);


    // Function to fetch tasks from the API
    const fetchTasks = async (page = 0, size = 6, sort = 'id,desc') => {
        const token = Cookies.get('idToken');
        try {
            const queryParams = `page=${page}&size=${size}&sort=${sortOption}${filterStatus ? `&status=${filterStatus}` : ''}${filterCategory ? `&categoryId=${filterCategory}` : ''}`;
            const response = await fetch(`${API_URL}/tasks?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
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
    const fetchCategories = async (page = 0, size = 6) => {
        const token = Cookies.get('idToken');
        try {
            const queryParams = `page=${page}&size=${size}&sort=id,desc`;
            const response = await fetch(`${API_URL}/categories?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
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

    {/* Fetch all tasks from the API on component mount */ }
    useEffect(() => {
        fetchCategories();
        fetchTasks();
        const token = Cookies.get('idToken');
        if (!token) {
            router.push('/');
        }
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken['cognito:username']);
    }, [sortOption, filterStatus, filterCategory]);

    const handleSortChange = (newSortOption) => {
        setSortOption(newSortOption);
    };

    const handleFilterChange = (newFilterStatus) => {
        setFilterStatus(newFilterStatus);
    };

    const handleCategoryChange = (newCategoryId, newCategoryTitle) => {
        setFilterCategory(newCategoryId);
        setFilterCategoryTitle(newCategoryTitle);
    };

    {/* Function to edit a category */ }
    const onEditCategory = async (editedCategoryData) => {
        const token = Cookies.get('idToken');
        console.log('Edited category data:', editedCategoryData);
        try {
            const response = await fetch(`${API_URL}/categories`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editedCategoryData)
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Category edited:', data);
                addToast('Category edited successfully!', 'success');
                fetchCategories(); // Fetch categorys again to update the list
            } else {
                // If the response code is 400, warn the user about invalid input
                if (response.status === 400) {
                    console.error('Invalid input for category edition');
                    addToast('Invalid input for category edition', 'danger');
                }
                else if (response.status === 403) {
                    console.error('Unauthorized to edit category');
                    router.push('/login'); // Redirect to login if not authorized
                }
                console.error('Failed to edit category');
            }
        } catch (error) {
            console.error('Error editing category:', error);
            addToast('Error editing category', 'danger');
        }

    };

    {/* Function to delete a category */ }
    const onDeleteCategory = async (deleteDTO) => {
        const token = Cookies.get('idToken');
        try {
            const response = await fetch(`${API_URL}/categories`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(deleteDTO)
            });
            if (response.ok) {
                console.log('Category deleted: ', deleteDTO.id);
                addToast('Category deleted successfully!', 'success');
                fetchCategories(); // Fetch categories again to update the list
                fetchTasks(); // Fetch tasks again to update the list
            } else {
                // If the response code is 400, warn the user about invalid input
                if (response.status === 400) {
                    console.error('Invalid input for category deletion');
                    addToast('Invalid input for category deletion', 'error');
                }
                else if (response.status === 403) {
                    console.error('Unauthorized to delete category');
                    router.push('/login'); // Redirect to login if not authorized
                }
                console.error('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            addToast('Error deleting category', 'error');
        }

    };

    {/* Function to create a category */ }
    const onCreateCategory = async (newCategoryData) => {
        const token = Cookies.get('idToken');
        try {
            const response = await fetch(`${API_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newCategoryData)
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Category created:', data);
                addToast('Category created successfully!', 'success');
                fetchCategories(); // Fetch categories again to update the list
            } else {
                // If the response code is 400, warn the user about invalid input
                if (response.status === 400) {
                    console.error('Invalid input for category creation');
                    addToast('Invalid input for category creation', 'error');
                }
                else if (response.status === 403) {
                    console.error('Unauthorized to create category');
                    router.push('/login'); // Redirect to login if not authorized
                }
                console.error('Failed to create category');
            }
        } catch (error) {
            console.error('Error creating category:', error);
            addToast('Error creating category:', 'error');
        }
    }

    const handleCreateCategory = (newCategoryData) => {
        onCreateCategory(newCategoryData);
        setShowCategoryCreateModal(false);
    };

    {/* Function to edit a task */ }
    const onEditTask = async (editedTaskData) => {
        const token = Cookies.get('idToken');
        console.log('Edited task data:', editedTaskData);
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editedTaskData)
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Task edited:', data);
                addToast('Task edited successfully!', 'success');
                fetchTasks(); // Fetch tasks again to update the list
            } else {
                // If the response code is 400, warn the user about invalid input
                if (response.status === 400) {
                    console.error('Invalid input for task edition');
                    addToast('Invalid input for task edition', 'danger');
                }
                else if (response.status === 403) {
                    console.error('Unauthorized to edit task');
                    router.push('/login'); // Redirect to login if not authorized
                }
                console.error('Failed to edit task');
            }
        } catch (error) {
            console.error('Error editing task:', error);
            addToast('Error editing task:', 'danger');
        }

    };


    {/* Function to delete a task */ }
    const onDeleteTask = async (id) => {
        const token = Cookies.get('idToken');
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: id
            });
            if (response.ok) {
                console.log('Task deleted: ', id);
                addToast('Task deleted successfully!', 'success');
                fetchTasks(); // Fetch tasks again to update the list
            } else {
                // If the response code is 400, warn the user about invalid input
                if (response.status === 400) {
                    console.error('Invalid input for task deletion');
                    addToast('Invalid input for task deletion', 'danger');
                }
                else if (response.status === 403) {
                    console.error('Unauthorized to delete task');
                    router.push('/login'); // Redirect to login if not authorized
                }
                console.error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            addToast('Error deleting task', 'danger');
        }

    };

    {/* Function to create a task */ }
    const onCreateTask = async (newTaskData) => {
        const token = Cookies.get('idToken');
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTaskData)
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Task created:', data);
                addToast('Task created successfully!', 'success');
                fetchTasks(); // Fetch tasks again to update the list
            } else {
                // If the response code is 400, warn the user about invalid input
                if (response.status === 400) {
                    console.error('Invalid input for task creation');
                    addToast('Invalid input for task creation', 'danger');
                }
                else if (response.status === 403) {
                    console.error('Unauthorized to create task');
                    router.push('/login'); // Redirect to login if not authorized
                }
                console.error('Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            addToast('Error creating task', 'danger');
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
                <Toasts toasts={toasts} setToasts={setToasts} />
                <div className="container-fluid flex-grow-1 d-flex flex-column">
                    <div className="row flex-grow-1" style={{ height: '100%' }}>
                        {/* Tasks Section */}
                        <div className="col-md-9 h-100 d-flex flex-column">
                            <div className="card flex-grow-1">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    {/* Centered Header */}
                                    <h4 className="text-start flex-grow-1 mb-0">Tasks</h4>

                                    {/* Sort and Filter Buttons */}
                                    <div className="d-flex align-items-center">
                                        {/* Sort Dropdown */}
                                        <div className="dropdown me-2">
                                            <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                Sort: {sortOptionToText[sortOption] || 'None'}
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end text-end" aria-labelledby="sortDropdown">
                                                <li><a className="dropdown-item" onClick={() => handleSortChange('id,desc')}>None</a></li>
                                                <li><a className="dropdown-item" onClick={() => handleSortChange('priority,asc')}>Priority</a></li>
                                                <li><a className="dropdown-item" onClick={() => handleSortChange('deadline,asc')}>Deadline</a></li>
                                                <li><a className="dropdown-item" onClick={() => handleSortChange('createdAt,desc')}>Creation Date</a></li>
                                                <li><a className="dropdown-item" onClick={() => handleSortChange('completionStatus,asc')}>Completion Status</a></li>
                                            </ul>
                                        </div>

                                        {/* Filter Dropdown */}
                                        <div className="dropdown me-2">
                                            <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="filterDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                Filter: {filterStatusToText[filterStatus] || 'None'}
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end text-end" aria-labelledby="filterDropdown">
                                                <li><a className="dropdown-item" onClick={() => handleFilterChange('')}>None</a></li>
                                                <li><a className="dropdown-item" onClick={() => handleFilterChange('IDLE')}>Idle</a></li>
                                                <li><a className="dropdown-item" onClick={() => handleFilterChange('ONGOING')}>Ongoing</a></li>
                                                <li><a className="dropdown-item" onClick={() => handleFilterChange('COMPLETED')}>Completed</a></li>
                                            </ul>
                                        </div>

                                        {/* Category Dropdown */}
                                        <div className="dropdown">
                                            <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="categoryDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                Category: {filterCategoryTitle}
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end text-end" aria-labelledby="categoryDropdown">
                                                <li>
                                                    <a className="dropdown-item" onClick={() => handleCategoryChange('', 'All')}>All</a>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item" onClick={() => handleCategoryChange(-1, 'None')}>None</a>
                                                </li>
                                                {categories.map(category => (
                                                    <li key={category.id}>
                                                        <a className="dropdown-item" onClick={() => handleCategoryChange(category.id, category.title)}>
                                                            {category.title > 15 ? category.title.substring(0, 11) + '...' : category.title}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body overflow-auto" style={{ height:'70vh', maxHeight: '70vh' }}>
                                    {/* Display a message if there are no tasks */}
                                    {tasks && tasks.length === 0 && (
                                        <div className="text-center text-muted fst-italic">
                                            Create new tasks by clicking the 'New Task' button below
                                        </div>
                                    )}

                                    {/* Map over tasks and render the Task components */}
                                    {tasks && tasks.map(task => (
                                        <Task
                                            key={task.id}
                                            category={task.category}
                                            id={task.id}
                                            title={task.title}
                                            completionStatus={task.completionStatus}
                                            priority={task.priority}
                                            deadline={task.deadline}
                                            description={task.description}
                                            categories={categories}
                                            onEdit={onEditTask}
                                            onDelete={onDeleteTask}
                                        />
                                    ))}

                                    {/* Center the Load More button */}
                                    {tasks && tasks.length >= 6 && (
                                        <div className="d-flex justify-content-center mt-2">
                                            <button
                                                className="btn btn-outline-tt-color"
                                                onClick={() => fetchTasks(0, tasks.length + 12)}
                                                style={{ height: '35px' }}
                                            >
                                                <span className="me-2">&#x25BC;</span>Load More
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button className="btn text-white tt-bgcolor mt-2 align-self-end" onClick={() => handleNewTask()}>
                                <span className="me-2">+</span>New Task
                            </button>
                            <TaskModal
                                show={showTaskCreateModal}
                                onClose={() => setShowTaskCreateModal(false)}
                                onSave={handleCreateTask}
                                initialData={taskData}
                                categories={categories}
                            />

                        </div>
                        {/* Categories Section */}
                        <div className="col-md-3 h-100 d-flex flex-column">
                            <div className="card flex-grow-1">
                                <div className="card-header text-center">
                                    <h4>Categories</h4>
                                </div>
                                <div className="card-body overflow-auto" style={{ height:'70vh', maxHeight: '70vh' }}>
                                    {/* Display a message if there are no categories */}
                                    {categories && categories.length === 0 && (
                                        <div className="text-center text-muted fst-italic">
                                            Create new categories by clicking the 'New Category' button below
                                        </div>
                                    )}
                                    {categories && categories.map(category => (
                                        <Category
                                            key={category.id}
                                            id={category.id}
                                            title={category.title}
                                            description={category.description}
                                            onEdit={onEditCategory}
                                            onDelete={onDeleteCategory}
                                        />
                                    ))}
                                    {/* Center the Load More button */}
                                    {categories && categories.length >= 6 && (
                                        <div className="d-flex justify-content-center mt-2">
                                            <button
                                                className="btn btn-outline-tt-color"
                                                onClick={() => fetchCategories(0, categories.length + 12)}
                                                style={{ height: '35px' }}
                                            >
                                                <span className="me-2">&#x25BC;</span>Load More
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button className="btn text-white tt-bgcolor mt-2 align-self-end" onClick={() => handleNewCategory()}>
                                <span className="me-2">+</span>New Category
                            </button>
                            <CategoryModal
                                show={showCategoryCreateModal}
                                onClose={() => setShowCategoryCreateModal(false)}
                                onSave={handleCreateCategory}
                                initialData={categoryData}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
