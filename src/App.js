import './App.css';
import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Workout from './pages/Workout';
import { UserProvider } from './UserContext';

function App() {
  const [user, setUser] = useState({ id: null });

  // Memoize unsetUser to prevent it from being a new function on every render
  const unsetUser = useCallback(() => {
    localStorage.removeItem('token');
    setUser({ id: null });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`https://fitnessapp-api-ln8u.onrender.com/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {  // Ensure API consistency: data.user should exist if logged in
          setUser({ id: data.user._id });
        } else {
          setUser({ id: null });
        }
      })
      .catch(() => setUser({ id: null }));
    }
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/workouts" element={<Workout />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
