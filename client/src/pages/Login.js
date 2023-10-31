import "./Login.css";

export default function Login() {
  //loadUsers. If file doesn't exist, create it.

  return (
    <div>
      <div className="Login">
        <h2>Enter your login details here</h2>
        <input type="text" placeholder="Username" />
        <input type="text" placeholder="Password" />
        <button onClick={() => {}} />
      </div>
      <div className="Register">
        <h2>Not signed up yet? Register below</h2>
        <input type="text" placeholder="Register Username" />
        <input type="text" placeholder="Register Password" />
        <button onClick={() => {}} />
      </div>
    </div>
  );
}
