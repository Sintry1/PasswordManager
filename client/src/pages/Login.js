import "./Login.css";
import { useState, useEffect } from "react";
import Axios from "axios";



export default function Login() {

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [userList, setUserList] = useState([]);

  //loadUsers. If file doesn't exist, create it.
  // The empty array means the useEffect is only called when the page re-renders, and not every time there is a state change
  useEffect(() => {
    Axios.get("http://localhost:3005/loadUsers").then((response) => {
      setUserList(response.data);
    });
  }, []);

  const addUser = () => {
    Axios.post("http://localhost:3005/createUser", {
      username: username,
      password: password,
    })


  };

  return (
    <div>
      <div className="Login">
        <h2>Enter your login details here</h2>
        <input type="text" placeholder="Username" />
        <input type="text" placeholder="Password" />
        <button onClick={() => {}} />
      </div>
      <div className="Register">
        <h2>Not signed up yet? Register below</h2>
        <input type="text" placeholder="Register Username" />
        <input type="text" placeholder="Register Password" />
        <button onClick={() => {}} />
      </div>
    </div>
  );
}
