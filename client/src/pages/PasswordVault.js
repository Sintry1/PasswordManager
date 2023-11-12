import { useEffect, useState } from "react";
import "./PasswordVault.css";
import Modal from "react-modal";

export default function PasswordVault() {
  const bcrypt = require("bcryptjs");
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
    const passwordList = storedPasswords ? JSON.parse(storedPasswords) : {};

    // Reconstruct the proper structure
    for (const site in passwordList) {
      const entry = passwordList[site];
      if (entry.iv && entry.password) {
        entry.password = {
          iv: new Uint8Array(entry.iv),
          password: new Uint8Array(entry.password),
        };
      }
    }

    setPasswordList(passwordList);
    console.log(passwordList);
    return passwordList;
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

    // const exportedKey = await crypto.subtle.exportKey("raw", derivedKey);

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
        }
      };

      // Update the state with the new password list
      setPasswordList(currentPasswordList);

      // Update localStorage if necessary
      localStorage.setItem("passwordList", JSON.stringify(currentPasswordList));

      console.log("Password successfully added.");
    }
  };

  // const encryptInput = async (password) => {
  //   const masterKey = await hashMasterPassword();

  //   const keyMaterial = await crypto.subtle.exportKey("raw", masterKey);

  //   const key = await crypto.subtle.deriveKey(
  //     {
  //       name: "PBKDF2",
  //       salt: new TextEncoder().encode(localStorage.getItem("Salt")),
  //       iterations: 100000,
  //       hash: { name: "SHA-256" },
  //     },
  //     await crypto.subtle.importKey(
  //       "raw",
  //       keyMaterial,
  //       { name: "PBKDF2" },
  //       false,
  //       ["deriveKey"]
  //     ),
  //     { name: "AES-GCM", length: 256 },
  //     true,
  //     ["encrypt", "decrypt"]
  //   );

  //   const iv = crypto.getRandomValues(new Uint8Array(16));
  //   const cipher = await crypto.subtle
  //     .encrypt(
  //       { name: "AES-GCM", iv: iv },
  //       key,
  //       new TextEncoder().encode(password)
  //     )
  //     .catch((error) => {
  //       console.error("Error during encryption:", error);
  //       throw error;
  //     });

  //   // Log the encrypted password and IV to the console (for demonstration purposes)
  //   console.log("Encrypted Password:", cipher);
  //   console.log("IV:", iv);
  //   return {
  //     iv: iv,
  //     password: new Uint8Array(cipher),
  //   };
  // };

  const encryptInput = async (password, masterKey) => {
    const keyMaterial = await crypto.subtle.exportKey("raw", masterKey);

    console.log("Key material inside encryptInput:", keyMaterial);

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

    console.log("key inside encryptInput:", key);

    console.log(
      "Encrypted Password inside encryptInput:",
      new Uint8Array(cipher)
    );
    console.log("IV inside encryptInput:", iv);

    return {
      iv: iv,
      password: new Uint8Array(cipher),
    };
  };

  // TESTED AND WORKING
  // const decryptInput = async (encryption) => {
  //   const masterKey = await hashMasterPassword();

  //   const keyMaterial = await crypto.subtle.exportKey("raw", masterKey);

  //   try {
  //     const key = await crypto.subtle.deriveKey(
  //       {
  //         name: "PBKDF2",
  //         salt: new TextEncoder().encode(localStorage.getItem("Salt")),
  //         iterations: 100000,
  //         hash: { name: "SHA-256" },
  //       },
  //       await crypto.subtle.importKey(
  //         "raw",
  //         keyMaterial, // Use the key material directly
  //         { name: "PBKDF2" },
  //         false,
  //         ["deriveKey"]
  //       ),
  //       { name: "AES-GCM", length: 256 },
  //       true,
  //       ["encrypt", "decrypt"]
  //     );

  //     // Convert password to Uint8Array
  //     const passwordUint8Array = new Uint8Array(encryption.password);

  //     const password = await crypto.subtle.decrypt(
  //       {
  //         name: "AES-GCM",
  //         iv: encryption.iv,
  //       },
  //       key,
  //       passwordUint8Array
  //     );

  //     // Log the decrypted password to the console (for demonstration purposes)
  //     console.log("Decrypted Password:", new TextDecoder().decode(password));

  //     return new TextDecoder().decode(password);
  //   } catch (error) {
  //     console.error("Error decrypting password:", error);
  //     console.error("Full error object:", error);
  //     console.error("Encryption object:", encryption);
  //     throw error;
  //   }
  // };

  const decryptInput = async (encryption, masterKey) => {
    try {
      console.log("Master Key inside decryptInput:", masterKey);

      const keyMaterial = await crypto.subtle.exportKey("raw", masterKey);

      console.log("Key Material inside decryptInput:", keyMaterial);

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

      console.log("Derived Key inside decryptInput:", key);

      const passwordUint8Array = new Uint8Array(encryption.password);
      console.log("Encryption.iv inside decryptInput", encryption.iv);
      console.log(
        "Encryption.password inside decryptInput",
        passwordUint8Array
      );

      // Log the types and values of iv and password
      console.log("Type of iv:", typeof encryption.iv);
      console.log("Type of password:", typeof encryption.password);

      // Log the values of iv and password
      console.log("Value of iv:", encryption.iv);
      console.log("Value of password:", passwordUint8Array);
      const decryptedPassword = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: encryption.iv,
        },
        key,
        passwordUint8Array
      );

      console.log(
        "Decrypted Password inside decryptInput:",
        new TextDecoder().decode(decryptedPassword)
      );

      return new TextDecoder().decode(decryptedPassword);
    } catch (error) {
      console.error("Error during decryption:", error);
      console.error("Error stack trace:", error.stack);
      throw error; // Rethrow the error for further analysis
    }
  };

  const decryptStoredPassword = async (site) => {
    // Prompt the user for the master password

    // Derive the master key
    const masterKey = await hashMasterPassword();

    // Retrieve the current password list
    const currentPasswordList = { ...passwordList };

    // Find the password entry for the specified site
    const encryptedPasswordObject = currentPasswordList[site]?.password;

    if (encryptedPasswordObject) {
      const iv = new Uint8Array(encryptedPasswordObject.iv); // Convert iv to Uint8Array
      const password = new Uint8Array(encryptedPasswordObject.password); // Convert password to Uint8Array

      console.log(
        "Encrypted Password Object in decryptStoredPassword:",
        password
      );

      // Decrypt using the derived master key
      const decryptedPassword = await decryptInput(
        encryptedPasswordObject,
        masterKey
      );
      console.log(
        "Decrypted Password in decryptStoredPassword:",
        decryptedPassword
      );

      return decryptedPassword;
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
        {/* <input
          className="Input"
          type="password"
          placeholder="Decryption Password"
          value={password}
          onChange={() => {}}
        /> */}
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
