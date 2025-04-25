import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function Register() {
  const notyf = new Notyf({ position: { x: 'center', y: 'top' } });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://fitnessapp-api-ln8u.onrender.com/users/register`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        notyf.success('Registration successful!');
      } else {
        notyf.error(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error("Error:", error);
      notyf.error('An unexpected error occurred.');
    }
  };

  return (
    <Form onSubmit={registerUser}>
      <h1 className="my-5 text-center">Register</h1>
      <Form.Group>
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Confirm Password:</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
