import { useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../UserContext';

export default function Logout() {
  const { unsetUser } = useContext(UserContext);

  useEffect(() => {
    const notyf = new Notyf({ position: { x: 'center', y: 'top' } });
    unsetUser();
    notyf.success("Logged out successfully!");
  }, [unsetUser]);

  return <Navigate to="/login" />;
}
