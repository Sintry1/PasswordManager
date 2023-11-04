import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PasswordVault from "./pages/PasswordVault";

function App() {


  

  



  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vault" element={<PasswordVault />} />
        </Routes>
      </BrowserRouter>
      {/* <div className="addPassword">
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
      </div> */}
    </div>
  );
}
export default App;
