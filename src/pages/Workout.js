import { useState } from 'react';
import { Form, Button, Card, Col, Row, Container, Modal } from 'react-bootstrap';
import { Notyf } from 'notyf';
import "../App.css";

export default function Workout() {
  const notyf = new Notyf({ position: { x: 'center', y: 'top' } });

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);

  const token = localStorage.getItem("token");

  const getWorkouts = async () => {
    if (!token) {
      notyf.error("Please log in to view your workouts.");
      return;
    }

    try {
      const res = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setWorkouts(data.workouts || []);
      notyf.success("Workouts fetched successfully!");
    } catch (error) {
      console.error("Error fetching workouts:", error);
      notyf.error("Failed to retrieve workouts.");
    }
  };

  const addWorkout = async (e) => {
    e.preventDefault();

    if (!token) {
      notyf.error("Please log in to add a workout.");
      return;
    }

    try {
      const res = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name, duration }),
      });

      const data = await res.json();
      if (res.ok) {
        setWorkouts([...workouts, data]);
        setName("");
        setDuration("");
        notyf.success("Workout added successfully!");
        setShowModal(false);
      } else {
        notyf.error(data.message || "Failed to add workout.");
      }
    } catch (error) {
      console.error("Error adding workout:", error);
      notyf.error("An unexpected error occurred.");
    }
  };

  const deleteWorkout = async (id) => {
    try {
      const res = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/deleteWorkout/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setWorkouts(workouts.filter(workout => workout._id !== id));
        notyf.success("Workout deleted successfully!");
      } else {
        notyf.error("Failed to delete workout.");
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
      notyf.error("Failed to delete workout.");
    }
  };

  // New function to mark a workout as completed
  const completeWorkout = async (id) => {
    try {
      const res = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/completeWorkoutStatus/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        notyf.success("Workout marked as completed!");
        // Refresh workouts list to reflect updated status
        getWorkouts();
      } else {
        notyf.error(data.message || "Failed to mark workout as completed.");
      }
    } catch (error) {
      console.error("Error completing workout:", error);
      notyf.error("An unexpected error occurred.");
    }
  };

  const openEditModal = (workout) => {
    setCurrentWorkout(workout);
    setName(workout.name);
    setDuration(workout.duration);
    setShowEditModal(true);
  };

  const editWorkout = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/updateWorkout/${currentWorkout._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name, duration }),
      });

      const data = await res.json();
      if (res.ok) {
        getWorkouts();
        notyf.success("Workout updated successfully!");
        setShowEditModal(false);
      } else {
        notyf.error("Failed to update workout.");
      }
    } catch (error) {
      console.error("Error editing workout:", error);
      notyf.error("An unexpected error occurred.");
    }
  };

  return (
    <Container className="workout-container">
      <h1 className="text-center title">My Workouts</h1>

      <Button variant="primary" className="mt-3" onClick={() => setShowModal(true)}>
        Add Workout
      </Button>

      {/* Add Workout Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addWorkout}>
            <Form.Group>
              <Form.Label>Workout Name:</Form.Label>
              <Form.Control 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Duration:</Form.Label>
              <Form.Control 
                type="text" 
                required 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)} 
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Save Workout
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Button 
        variant="secondary" 
        className="mt-3 fetch-button" 
        onClick={getWorkouts}
      >
        Get Workouts
      </Button>

      <h2 className="mt-4">Workout History</h2>
      <Row>
        {workouts.map(workout => (
          <Col key={workout._id} md={4} className="mb-3">
            <Card className="workout-card">
              <Card.Body>
                <Card.Title>{workout.name}</Card.Title>
                <Card.Text>Duration: {workout.duration}</Card.Text>
                <Card.Text>
                  Status: {workout.status ? workout.status : "Pending"}
                </Card.Text>
                <div className="btn-container">
                  <Button variant="warning" onClick={() => openEditModal(workout)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => deleteWorkout(workout._id)}>
                    Delete
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => completeWorkout(workout._id)}
                    disabled={workout.status === "completed"}
                  >
                    {workout.status === "completed" ? "Completed" : "Complete"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Edit Workout Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={editWorkout}>
            <Form.Group>
              <Form.Label>Workout Name:</Form.Label>
              <Form.Control 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Duration:</Form.Label>
              <Form.Control 
                type="text" 
                required 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)} 
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
