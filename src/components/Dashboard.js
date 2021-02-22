import React, { useState, useEffect } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { db } from "../firebase";

export default function Dashboard() {
  const [error, setError] = useState("")
  const [data, setdbData] = useState([]);
  const { currentUser, logout } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

    //get data from db
    const getDataFirebase = async (user) => {
      await db.collection("scores").doc(currentUser.email).onSnapshot((querySnapshot) => {
        setdbData(querySnapshot.data());
      });
    };

    useEffect(() => {
      getDataFirebase(currentUser.mail)
    }, []);
    

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
          <br/>
          <strong>Your previous score:</strong> {data.score}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
          <Link to="/game" className="btn btn-primary w-100 mt-3">
            Go to Game
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </>
  )
}
