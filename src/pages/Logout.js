import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Logout() {
  const { unsetUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    unsetUser(); // Clear user data
    navigate('/login', { replace: true }); // Redirect to login
  }, [unsetUser, navigate]);

  return null; // No UI needed
}