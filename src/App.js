import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Workout from './pages/Workout';
import { UserProvider } from './UserContext';



function App() {

    const [user, setUser] = useState({
        id: null,
    });

    const unsetUser = () => {
      localStorage.clear();
    };

    useEffect(() => {

        fetch(`'https://fitnessapp-api-ln8u.onrender.com/users/details`, {
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            }
        })
        .then(res => res.json())
        .then(data => {
          
            if (typeof data.user !== "undefined") {

                setUser({
                  id: data.user._id,
                });

            } else {

                setUser({
                  id: null,
                });
            }
        })
    }, []);

    return (
        <UserProvider value={{user, setUser, unsetUser}}>
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
