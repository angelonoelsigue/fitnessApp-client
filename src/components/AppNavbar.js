import { useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../UserContext';

export default function AppNavbar() {
  const { user, setUser, unsetUser } = useContext(UserContext);
  const navigate = useNavigate();
  const notyf = new Notyf({ position: { x: 'center', y: 'top' } });

  // Sync user state with localStorage when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user?.id) {
      fetch('https://fitnessapp-api-ln8u.onrender.com/users/details', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data._id) {
          setUser({ id: data._id });
        }
      });
    }
  }, [user, setUser]);

  const handleLogout = () => {
    unsetUser();
    localStorage.removeItem("token");
    notyf.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <Navbar expand="lg" bg="light" className="bg-light">
      <Container>
        <Navbar.Brand as={Link} to="/">fitnessAPI</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/workouts">Workouts</Nav.Link>
          </Nav>
          <Nav>
            {user?.id ? ( // Uses `user` state from context instead of localStorage
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
