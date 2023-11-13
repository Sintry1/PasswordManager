import { useEffect, useState } from "react";
import "./PasswordVault.css";
import Modal from "react-modal";

export default function PasswordVault() {
  let salt = "";
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordList, setPasswordList] = useState([]);
  const [decryptSite, setDecryptSite] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadPasswords();
  }, []);

  const loadPasswords = () => {
    const storedPasswords = localStorage.getItem("passwordList");
    const currentPasswordList = storedPasswords
      ? JSON.parse(storedPasswords)
      : {};

    // Reconstruct the proper structure
    for (const site in currentPasswordList) {
      const entry = currentPasswordList[site];
      if (entry.iv && entry.password) {
        entry.password = {
          iv: new Uint8Array(entry.iv),
          password: new Uint8Array(entry.password),
        };
      }
    }

    setPasswordList(currentPasswordList);
    console.log(currentPasswordList);
    return currentPasswordList;
  };

  const hashMasterPassword = async () => {
    let masterPassword = prompt("Please enter your master password:");

    if (!localStorage.getItem("Salt")) {
      salt = crypto.getRandomValues(new Uint8Array(16));
      localStorage.setItem("Salt", new TextDecoder().decode(salt));
    } else {
      salt = new TextEncoder().encode(localStorage.getItem("Salt"));
    }

    const encodedPassword = new TextEncoder().encode(masterPassword);

    const keyMat = await crypto.subtle.importKey(
      "raw",
      encodedPassword,
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: { name: "SHA-256" },
      },
      keyMat,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    return derivedKey;
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
    setPassword(password);
    return password;
  };

  const clearAll = () => {
    setModalOpen(true);
  };

  const handleConfirm = () => {
    localStorage.clear();
    setModalOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const addPassword = async (site, username, password) => {
    const masterKey = await hashMasterPassword();

    // Retrieve the current password list
    const currentPasswordList = { ...passwordList };

    // Check if a password for the site already exists
    if (currentPasswordList[site]) {
      console.log(`A password for ${site} already exists.`);
    } else {
      const encryptedPassword = await encryptInput(password, masterKey);

      // Add the new password entry to the list
      currentPasswordList[site] = {
        site: site,
        username: username,
        password: {
          iv: Array.from(encryptedPassword.iv),
          password: Array.from(encryptedPassword.password),
        },
      };

      // Update the state with the new password list
      setPasswordList(currentPasswordList);

      // Update localStorage if necessary
      localStorage.setItem("passwordList", JSON.stringify(currentPasswordList));
      loadPasswords();

      console.log("Password successfully added.");
    }
  };

  const encryptInput = async (password, masterKey) => {
    const keyMaterial = await crypto.subtle.exportKey("raw", masterKey);

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new TextEncoder().encode(localStorage.getItem("Salt")),
        iterations: 100000,
        hash: { name: "SHA-256" },
      },
      await crypto.subtle.importKey(
        "raw",
        keyMaterial,
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
      ),
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(16));
    const cipher = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      new TextEncoder().encode(password)
    );


    return {
      iv: iv,
      password: new Uint8Array(cipher),
    };
  };

  const decryptInput = async (encryption, masterKey) => {
    try {
      const keyMaterial = await crypto.subtle.exportKey("raw", masterKey);

      const key = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: new TextEncoder().encode(localStorage.getItem("Salt")),
          iterations: 100000,
          hash: { name: "SHA-256" },
        },
        await crypto.subtle.importKey(
          "raw",
          keyMaterial,
          { name: "PBKDF2" },
          false,
          ["deriveKey"]
        ),
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );

      const iv = new Uint8Array(encryption.iv);
      const encryptedPassword = new Uint8Array(encryption.password);

      const decryptedPasswordBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encryptedPassword
      );

      // Convert the decrypted password ArrayBuffer to a string
      const decryptedPasswordString = new TextDecoder().decode(
        decryptedPasswordBuffer
      );

      return decryptedPasswordString;
    } catch (error) {
      console.error("Error during decryption:", error);
      throw error;
    }
  };

  const decryptStoredPassword = async (site) => {
    // Derive the master key
    const masterKey = await hashMasterPassword();

    // Retrieve the current password list
    const currentPasswordList = { ...passwordList };

    // Find the password entry for the specified site
    const encryptedPasswordObject = currentPasswordList[site]?.password;

    if (encryptedPasswordObject) {
      try {

        // Decrypt using the derived master key
        const decryptedPassword = await decryptInput(
          encryptedPasswordObject,
          masterKey
        );

        console.log("Decrypted Password:", decryptedPassword);

        return decryptedPassword;
      } catch (error) {
        console.error("Error decrypting password:", error.message);
      }
    } else {
      alert(`No password found for ${site}`);
    }
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
        <h1>Password vault</h1>
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
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="Input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button className="Button" onClick={() => generateStrongPassword()}>
          Generate a strong password
        </button>
        <button
          className="Button"
          onClick={() => addPassword(site, username, password)}
        >
          Add Password
        </button>
      </div>
      <div>
        <h2>Input a password you would like to decrypt</h2>
        <input
          className="Input"
          type="text"
          placeholder="Site/Platform"
          onChange={(e) => setDecryptSite(e.target.value)}
        />
        <button
          className="Button"
          onClick={() => decryptStoredPassword(decryptSite)}
        >
          Decrypt Password
        </button>
      </div>
      <div>
        <button className="Button" onClick={clearAll}>
          Clear All Passwords
        </button>

        <Modal
          isOpen={modalOpen}
          contentLabel="Confirmation Modal"
          className="Modal"
          ariaHideApp={false}
        >
          <div>
            <p>Are you sure you want to clear all passwords stored?</p>
            <button className="Button" onClick={handleConfirm}>
              Yes, clear it!
            </button>
            <button className="Button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
