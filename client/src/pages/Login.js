import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
// import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newUser, setNewUser] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [userList, setUserList] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  //loadUsers. If file doesn't exist, create it.
  // The empty array means the useEffect is only called when the page re-renders, and not every time there is a state change
  useEffect(() => {
    Axios.get("http://localhost:3005/loadUsers").then((response) => {
      setUserList(response.data);
    });
  }, []);



  return (
    <div className="LoginPage">
      <div className="Login">
        <h2>Enter your login details here</h2>
        <input
          className="Input"
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="Input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="Button" onClick={() => {}}>
          Log in
        </button>
      </div>
      <div className="Register">
        <h2>Not signed up yet? Register below</h2>
        <input
          className="Input"
          type="text"
          placeholder="Register Username"
          onChange={(e) => setNewUser(e.target.value)}
        />
        <input
          className="Input"
          type="password"
          placeholder="Register Password"
          onChange={(e) => setNewUserPassword(e.target.value)}
        />
        <button
          className="Button"
          onClick={() => {}}
        >
          Register
        </button>
      </div>
    </div>
  );
}
