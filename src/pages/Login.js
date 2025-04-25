import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { Notyf } from 'notyf';

import UserContext from '../UserContext';

export default function Login() {
    const notyf = new Notyf();
    const { user, setUser } = useContext(UserContext);

    // State hooks to store the values of the input fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // State to determine whether submit button is enabled or not
    const [isActive, setIsActive] = useState(true);

    function authenticate(e) {

        // Prevents page redirection via form submission
        e.preventDefault();
        fetch('https://fitnessapp-api-ln8u.onrender.com/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                email: email,
                password: password

            })
        })
        .then(res => res.json())
        .then(data => {

            if(data.access !== undefined){

                console.log(data.access);

                // Set the token of the authenticated user in the local storage
                // Syntax
                // localStorage.setItem('propertyName', value);
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);

                // Clear input fields after submission
                setEmail('');
                setPassword('');

                notyf.success('Successful Login');

            } else if (data.message == "Incorrect email or password") {

                notyf.error('Incorrect Credentials. Try Again');

            } else {

                notyf.error('User Not Found. Try Again.');

            }
        })

    }

    function retrieveUserDetails(token) {
      fetch('https://fitnessapp-api-ln8u.onrender.com/users/details', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          console.log("User Details Retrieved:", data);

          // Use the same structure as in App.js
          if (data.user && data.user._id) {
            setUser({ id: data.user._id });
            console.log("User State Updated in Context:", { id: data.user._id });
          } else {
            console.error("User details not properly returned");
          }
        })
        .catch(error => console.error("Error fetching user details:", error));
    }

    useEffect(() => {

        // Validation to enable submit button when all fields are populated and both passwords match
        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }

    }, [email, password]);

    return (
      user.id !== null 
        ? <Navigate to="/workouts" />
        : (
          <Form onSubmit={(e) => authenticate(e)}>
            <h1 className="my-5 text-center">Login</h1>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            { isActive 
              ? <Button variant="primary" type="submit" id="loginBtn">Login</Button>
              : <Button variant="danger" type="submit" id="loginBtn" disabled>Login</Button>
            }
          </Form>
        )
    );

}