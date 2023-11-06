import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PasswordVault from "./pages/PasswordVault";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/password-vault/:username" element={<PasswordVault />} />
      </Routes>
    </Router>
  );
}
export default App;
