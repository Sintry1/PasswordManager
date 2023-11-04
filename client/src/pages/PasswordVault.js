import { useState, useEffect } from "react";
import Axios from "axios";

export default function PasswordVault() {

  
  const [password, setPassword] = useState("");
  const [passwordList, setPasswordList] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3005/loadPasswords").then((response) => {
      setPasswordList(response.data);
    });
  }, []);

  const addPassword = (site, password) => {
    Axios.post("http://localhost:3005/addPassword")
  }

  const decryptPassword = (encryption) => {
    Axios.post("http://localhost:3005/decryptPassword").then((response) => {
      setPasswordList(
        passwordList.map((value) => {
          return value.id === encryption.id
            ? {
                site: response.data,
                password: value.password,
              
              }
            : value;
        })
      );
    });
  };

  
  return (
    <div className="vault">
      <div className=""></div>
    </div>
  );
}
