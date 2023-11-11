import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PasswordVault from "./pages/PasswordVault";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<PasswordVault />} />
      </Routes>
    </Router>
  );
}
export default App;
