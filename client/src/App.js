import "./App.css";
import { useState } from "react";
import Axios from 'axios';

function App() {
  const [site, setSite] = useState('');
  const [password, setPassword] = useState('');


  const addPassword = () => {
    Axios.post('http://localhost:3005/addpassword', {
      site: site, 
      password: password
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
          onChange={(event) =>{
            setPassword(event.target.value);
          }}
        />
        <button onClick={addPassword}>Add password</button>
      </div>
    </div>
  );
}

export default App;
