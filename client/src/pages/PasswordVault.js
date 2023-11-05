import { useState, useEffect } from "react";
import Axios from "axios";
import { jwtDecode } from "jwt-decode";
import { parse } from "cookie";

export default function PasswordVault() {
  const [ username, setUsername ] = useState(null);
  const [site, setSite] = useState("");
  const [password, setPassword] = useState("");
  const [passwordList, setPasswordList] = useState([]);
  const [decryptedPasswordList, setDecryptedPasswordList] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3005/loadPasswords").then((response) => {
      setPasswordList(response.data);
    });

    // Retrieve the JWT token from the cookie
    const cookies = parse(document.cookie); // Parse the document's cookies
    const token = cookies.token; // Replace 'token' with your actual cookie name

    if (token) {
      // Call the function to retrieve the username from the JWT
      const retrievedUsername = retrieveUsernameFromJWT(token);
      if (retrievedUsername) {
        setUsername(retrievedUsername);
      }
    }
  }, []);

  const retrieveUsernameFromJWT = (token) => {
    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
    } catch (error) {
      console.error("Error decoding JWT: ", error);
      return null;
    }
  };

  const addPassword = (site, password) => {
    Axios.post("http://localhost:3005/addPassword", {
      site: site,
      password: password,
    }).then(() => {
      setPasswordList([...passwordList, { site, password: password }]);
      alert("Password added successfully");
      setSite("");
      setPassword("");
    });
  };

  const decryptPassword = (site) => {
    Axios.post("http://localhost:3005/decryptPassword", {
      site: site,
    })
      .then((response) => {
        const decryptedPassword = response.data;
        return decryptedPassword;
      })
      .catch((error) => {
        console.error("Error decrypting password: ", error);
      });
  };

  const decryptAllPasswords = () => {
    // Use Promise.all to decrypt all passwords in parallel
    Promise.all(
      passwordList.map((passwordData) => decryptPassword(passwordData.site))
    )
      .then((decryptedPasswords) => {
        // Update the passwordList with decrypted passwords
        const updatedPasswordList = passwordList.map((passwordData, index) => ({
          ...passwordData,
          password: decryptedPasswords[index],
        }));
        setDecryptedPasswordList(updatedPasswordList);
      })
      .catch((error) => {
        console.error("Error decrypting passwords: ", error);
      });
  };

  const generateStrongPassword = () => {
    Axios.post("http://localhost:3005/generateStrongPassword").then(
      (response) => {
        const strongPassword = response.data;
        alert(
          "Here is your strong password. Copy it to the password field: ",
          strongPassword
        );
      }
    );
  };

  return (
    <div className="vault">
      <div>
        <h1>Password vault for {username}</h1>
      </div>
      <div>
        <h2>Add Password</h2>
        <input
          type="text"
          placeholder="site"
          value={site}
          onChange={(e) => setSite(e.target.value)}
        />
        <input
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => setSite(e.target.value)}
        />
        <button onClick={generateStrongPassword}>
          Generate a strong password
        </button>
        <button onClick={() => addPassword(site, password)}>
          Add Password
        </button>
      </div>
      <div>
        <button onClick={decryptAllPasswords}>Decrypt all Passwords</button>
        <ul>
          {decryptedPasswordList.map((passwordData, index) => (
            <li key={index}>Site: {passwordData.password.password}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
