// src/App.js
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

const Task = ({ task, onDelete, onToggle }) => {
  return (
    <div className={`task ${task.completed ? 'completed' : ''}`} onDoubleClick={() => onToggle(task.id)}>
      <div>
        <h3>{task.name}</h3>
        <p>{`Added on ${task.dateAdded}`}</p>
      </div>
      <div>
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />
        <button onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  );
};

const TaskList = ({ tasks, onDelete, onToggle, filter }) => {
  const filteredTasks = filter === 'all' ? tasks : tasks.filter(task => task.completed === (filter === 'completed'));

  return (
    <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {filteredTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Task task={task} onDelete={onDelete} onToggle={onToggle} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const TaskForm = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState('');

  const handleAddTask = () => {
    if (taskName.trim() !== '') {
      const newTask = {
        id: Date.now(),
        name: taskName,
        dateAdded: new Date().toLocaleDateString(),
        completed: false,
      };
      onAddTask(newTask);
      setTaskName('');
    }
  };

  return (
    <div className="task-form">
      <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="Enter task name" />
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

const FilterButtons = ({ setFilter }) => {
  return (
    <div className="filter-buttons">
      <button onClick={() => setFilter('all')}>All</button>
      <button onClick={() => setFilter('completed')}>Completed</button>
      <button onClick={() => setFilter('incomplete')}>Incomplete</button>
    </div>
  );
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Load tasks from local storage on component mount
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  useEffect(() => {
    // Save tasks to local storage whenever tasks are updated
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const toggleTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="app">
      <h1>Task Tracker</h1>
      <TaskForm onAddTask={addTask} />
      <FilterButtons setFilter={setFilter} />
      {tasks.length > 0 ? (
        <TaskList tasks={tasks} onDelete={deleteTask} onToggle={toggleTask} filter={filter} />
      ) : (
        <p className="no-tasks">No tasks available.</p>
      )}
    </div>
  );
};

export default App;










