import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { jwtDecode } from "jwt-decode";

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

  const addUser = (username, password) => {
    Axios.post("http://localhost:3005/createUser", {
      username: username,
      password: password,
    })
      .then(() => {
        console.log("User added. You can now login.");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const login = (username, password) => {
    Axios.post("http://localhost:3005/login", {
      username: username,
      password: password,
    }).then((response) => {
      console.log("Reponse: ", response.data);
      if (response.data && response.data.token) {
        console.log("Token on client side: ", response.data.token);
        document.cookie = "token=" + response.data.token + "; path=/;";
        console.log("Cookie set:", document.cookie.token);
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find((cookie) =>
          cookie.startsWith("token=")
        );
        if (tokenCookie) {
          const token = tokenCookie.split("=")[1];
          console.log("Token from cookies: ", token);
          const decoded = jwtDecode(token);
          setAuthenticated(true);
          navigate(`/password-vault/${decoded.username}`);
        }
      }
    });
  };

  return (
    <div>
      <div className="Login">
        <h2>Enter your login details here</h2>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => login(username, password)} />
      </div>
      <div className="Register">
        <h2>Not signed up yet? Register below</h2>
        <input
          type="text"
          placeholder="Register Username"
          onChange={(e) => setNewUser(e.target.value)}
        />
        <input
          type="text"
          placeholder="Register Password"
          onChange={(e) => setNewUserPassword(e.target.value)}
        />
        <button onClick={() => addUser(newUser, newUserPassword)} />
      </div>
    </div>
  );
}
