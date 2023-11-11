import { useEffect, useState } from "react";
import "./PasswordVault.css";

export default function PasswordVault() {
  const bcrypt = require("bcrypt");
  let salt = "";
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordList, setPasswordList] = useState([]);
  const [decryptedPasswordList, setDecryptedPasswordList] = useState([]);

  useEffect(() => {}, []);

  const hashMasterPassword = () => {
    let password = prompt("Please enter your master password:");
    const saltRounds = 10; // Specify the number of salt rounds
    if (localStorage.getItem("Salt")) {
      salt = localStorage.setItem("Salt");
    } else {
      salt = bcrypt.genSaltSync(saltRounds);
      localStorage.setItem("Salt:", salt);
    }

    const hashedPassword = bcrypt.hashSync(password, salt);

    return hashedPassword;
  };

  const generateStrongPassword = (length = 32) => {
    // Define character set character sets to create the full character pool
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|:"<>?-=/\\';

    let password = "";
    for (let i = 0; i < length; i++) {
      // Randomly select a character from the character pool
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars.charAt(randomIndex);
    }
    return password;
  };

  const loadPasswords = () => {
    const storedPasswords = localStorage.getItem("passwordList")

    const passwordList = storedPasswords ? JSON.parse(storedPasswords) : {};

    return passwordList;
  };

  const addPassword = (site, username, password) => {
    const passwordList = loadPasswords();
    if (passwordList[site]) {
      console.log(`A password for ${site} already exists.`);
    } else {
      const encryptedPassword = encryptInput(password);
      passwordList[site] = {
        site: site,
        username: username,
        password: encryptedPassword,
      };
      localStorage.setItem("passwordList", JSON.stringify(passwordList))
      console.log("Password successfully added.");
    }
  };

  const encryptInput = (password) => {
    const key = crypto
      .pbkdf2Sync(hashMasterPassword(), localStorage.getItem("Salt"), 100000, 32, "sha256")
      .toString("base64");

    const iv = Buffer.from(crypto.randomBytes(16));
    const cipher = crypto.createCipheriv(
      "aes-256-ctr",
      Buffer.from(key, "base64"),
      iv
    );

    const encryptedPassword = Buffer.concat([
      cipher.update(password, "utf-8"),
      cipher.final(),
    ]);

    return {
      iv: iv.toString("hex"),
      password: encryptedPassword.toString("hex"),
    };
  };

  // TESTED AND WORKING
  const decryptInput = (encryption) => {
    const key = crypto
      .pbkdf2Sync(hashMasterPassword(), localStorage.getItem("Salt"), 100000, 32, "sha256")
      .toString("base64");

    const iv = Buffer.from(encryption.iv, "hex");
    const decipher = crypto.createDecipheriv(
      "aes-256-ctr",
      Buffer.from(key, "base64"),
      iv
    );

    const decryptedPassword = Buffer.concat([
      decipher.update(Buffer.from(encryption.password, "hex")),
      decipher.final(),
    ]);

    return decryptedPassword.toString("utf-8");
  };

  const handlePasswordChange = (e) => {
    if (generatedPassword) {
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
          type="text"
          placeholder="Username"
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
        <button className="Button" onClick={() => addPassword(site, username, password)}>
          Add Password
        </button>
      </div>
      <div>
        <button className="Button" onClick={() => {}}>
          Decrypt all Passwords
        </button>
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
