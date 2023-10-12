import "./App.css";
import { useState } from "react";

function App() {
  const [site, setSite] = useState("");
  const [password, setPassword] = useState("");

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
            setPassword(event.password.value);
          }}
        />
        <button>Add password</button>
      </div>
    </div>
  );
}

export default App;
