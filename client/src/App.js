import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [site, setSite] = useState("");
  const [password, setPassword] = useState("");
  const [passwordList, setPasswordList] = useState([]);

  


  // The empty array means the useEffect is only called when the page re-renders, and not every time there is a state change
  useEffect(() => {
    Axios.get("http://localhost:3005/getpasswords").then((response) => {
      setPasswordList(response.data);
    });
  }, []);

  const addPassword = () => {
    Axios.post("http://localhost:3005/addpassword", {
      site: site,
      password: password,
    }).then(() => {
      // Update the password list
      Axios.get("http://localhost:3005/getpasswords").then((response) => {
        setPasswordList(response.data);
      });

      // Clear the input fields by refreshing the page
      window.location.reload();
    });
  };

  const decryptPassword = (encryption) => {
    Axios.post("http://localhost:3005/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      setPasswordList(
        passwordList.map((value) => {
          return value.id === encryption.id
            ? {
                id: value.id,
                password: value.password,
                site: response.data,
                iv: value.iv,
              }
            : value;
        })
      );
    });
  };

  return (
    <div className="App">
      <div className="addPassword">
        <input
          type="text"
          placeholder="Example site 123"
          onChange={(event) => {
            setSite(event.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Examplepassword123"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <button onClick={addPassword}>Add password</button>
      </div>
      <div className="Passwords">
        {passwordList.map((value, key) => {
          return (
            <div
              className="password"
              onClick={() => {
                decryptPassword({
                  password: value.password,
                  iv: value.iv,
                  id: value.id,
                });
              }}
              key={key}
            >
              <h3>{value.site}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default App;