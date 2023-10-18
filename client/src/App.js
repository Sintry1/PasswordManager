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
    }).then((response) => {
      console.log(response.data);
    });
  };

  const decryptPassword = (encryption) => {
    Axios.post("http://localhost:3005/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      console.log(response.data);
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
      <div className="passwords">
        {passwordList.map((value, key) => {
          return (
            <div
              className="password"
              onClick={() => {
                decryptPassword({
                  password: value.password,
                  iv: value.iv,
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
