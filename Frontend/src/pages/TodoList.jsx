import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const { user, logout } = useContext(AuthContext);

  const fetchTodos = async () => {
    try {
      const res = await axios.get('/api/todos', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTodos(res.data);
    } catch (error) {
      console.error('Error fetching todos', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await axios.post('/api/todos', { title }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTodos([...todos, res.data]);
      setTitle('');
    } catch (error) {
      console.error('Error adding todo', error);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const res = await axios.put(`/api/todos/${id}`, { completed: !currentStatus }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTodos(todos.map(todo => todo._id === id ? res.data : todo));
    } catch (error) {
      console.error('Error updating todo', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo', error);
    }
  };

  return (
    <div className="todo-container">
      <div className="header">
        <h2>My Tasks</h2>
        <button onClick={logout} className="btn btn-danger" style={{ width: 'auto' }}>Logout</button>
      </div>

      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
        />
        <button type="submit" className="btn" style={{ width: 'auto' }}>Add</button>
      </form>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo._id} className="todo-item">
            <span 
              className={`todo-text ${todo.completed ? 'completed' : ''}`}
              onClick={() => toggleComplete(todo._id, todo.completed)}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo._id)} className="delete-btn">
              ✕
            </button>
          </li>
        ))}
        {todos.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No tasks yet. Add one above!</p>
        )}
      </ul>
    </div>
  );
};

export default TodoList;
