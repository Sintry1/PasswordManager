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
    })
      .then((response) => {
        console.log("logged in:", response.data.loggedIn);
        if (response.data.loggedIn) {
          console.log(`login successful for username: ${username}`);
          navigate(`/password-vault/${username}`);
        }

        // if (response.status === 200) {
        //   // Successful login, navigate to the new page.
        //   console.log("Redirecting to the new page...");
        //   navigate(`/password-vault/${username}`);
        // } else {
        //   // Handle unsuccessful login here, if needed.
        //   console.log("Login unsuccessful.");
        // }
      })
      .catch((error) => {
        // Handle errors or unsuccessful login here.
        console.error("Error during login:", error);
      });
  };
  //   if (response.data && response.data.token) {
  //     console.log("Token on client side: ", response.data.token);
  //     document.cookie = "token=" + response.data.token + "; path=/;";
  //     console.log("Cookie set:", document.cookie.token);
  //     const cookies = document.cookie.split("; ");
  //     const tokenCookie = cookies.find((cookie) =>
  //       cookie.startsWith("token=")
  //     );
  //     if (tokenCookie) {
  //       const token = tokenCookie.split("=")[1];
  //       console.log("Token from cookies: ", token);
  //       const decoded = jwtDecode(token);
  //       setAuthenticated(true);
  //       navigate(`/password-vault/${decoded.username}`);
  //     }
  //   }
  // });
  //};

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
        <button className="Button" onClick={() => login(username, password)}>
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
          onClick={() => addUser(newUser, newUserPassword)}
        >
          Register
        </button>
      </div>
    </div>
  );
}
