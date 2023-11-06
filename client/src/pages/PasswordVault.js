import Axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PasswordVault.css"
// import { jwtDecode } from "jwt-decode";
// import { parse } from "cookie";

export default function PasswordVault() {
  const [site, setSite] = useState("");
  const [password, setPassword] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordList, setPasswordList] = useState([]);
  const [decryptedPasswordList, setDecryptedPasswordList] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    console.log("Axios request not yet made", username);
    Axios.get(`http://localhost:3005/loadPasswords/${username}`).then(
      (response) => {
        setPasswordList(response.data);
        console.log(username);
        if (response.data.length > 0) {
          decryptAllPasswords();
        }
      }
    );
  }, [username]);
  // // Retrieve the JWT token from the cookie
  // const cookies = parse(document.cookie); // Parse the document's cookies
  // const token = cookies.token; // Replace 'token' with your actual cookie name

  // if (token) {
  //   // Call the function to retrieve the username from the JWT
  //   const retrievedUsername = retrieveUsernameFromJWT(token);
  //   if (retrievedUsername) {
  //     setUsername(retrievedUsername);
  //   }
  // }

  // const retrieveUsernameFromJWT = (token) => {
  //   try {
  //     const decoded = jwtDecode(token);
  //     setUsername(decoded.username);
  //   } catch (error) {
  //     console.error("Error decoding JWT: ", error);
  //     return null;
  //   }
  // };

  const addPassword = (site, password) => {
    Axios.post("http://localhost:3005/addPassword", {
      site: site,
      password: password,
    }).then(() => {
      setPasswordList([{...passwordList, site, password: password }]);
      alert("Password added successfully");
      setSite("");
      setPassword("");
    }).then(() => {
      window.location.reload();
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
    const decryptionList = Object.keys(passwordList);
    console.log("DecryptionList: ",decryptionList);
    // Initialize an array to store promises
    const decryptionPromises = decryptionList.map((site) => {
      return Axios.post("http://localhost:3005/decryptPassword", {
        site: site,
      })
        .then((response) => {
          console.log("Inside decrypt All", response.data)
          return { site: site, password: response.data };
        })
        .catch((error) => {
          console.error(`Error decrypting password for ${site}: `, error);
          return { site: site, password: "Decryption Error" };
        });
    });

    Promise.all(decryptionPromises)
      .then((decryptedPasswords) => {
        console.log("Decrypted Passwords:", decryptedPasswords);
        setDecryptedPasswordList(decryptedPasswords);
      })
      .catch((error) => {
        console.error("Error decrypting passwords: ", error);
      });
  };

  const generateStrongPassword = () => {
    Axios.post("http://localhost:3005/generateStrongPassword").then(
      (response) => {
        const strongPassword = response.data;
        setGeneratedPassword(strongPassword);
        // alert(
        //   "Here is your strong password. Copy it to the password field: " +
        //     strongPassword
        // );
      }
    );
  };

  const handlePasswordChange = (e) => {
    if (generatedPassword) {
      // If a generated password exists, clear it when the user starts typing
      setGeneratedPassword("");
    }
    setPassword(e.target.value);
  };

  return (
    <div className="Vault">
      <div>
        <h1>Password vault for {username}</h1>
      </div>
      <div className="Add">
        <h2>Add Password</h2>
        <input
        className="Input"
          type="text"
          placeholder="Site/Platform"
          onChange={(e) => setSite(e.target.value)}
        />
        <input
        className="Input"
          type="password"
          placeholder="Password"
          value={generatedPassword || password}
          onChange={handlePasswordChange}
        />
        <button className="Button" onClick={generateStrongPassword}>
          Generate a strong password
        </button>
        <button className="Button"onClick={() => addPassword(site, password)}>
          Add Password
        </button>
      </div>
      <div>
        <button className="Button" onClick={decryptAllPasswords}>Decrypt all Passwords</button>
        <ul>
          {decryptedPasswordList.length > 0 ? (
            decryptedPasswordList.map((entry, index) => (
              <li key={index}>
                Site: {entry.site}
                <br />
                Decrypted Password: {entry.password.decryptedPassword}
              </li>
            ))
          ) : (
            <li>
              No decrypted passwords available. Click the button to decrypt.
            </li>
          )}
        </ul>
      </div>
      <div className="PasswordList">
        <h1>Password List</h1>
        <table>
          <thead>
            <tr>
              <th>Site</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(passwordList).map((site, index) => (
              <tr key={index}>
                <td>{passwordList[site].site}</td>
                <td>{passwordList[site].password.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
