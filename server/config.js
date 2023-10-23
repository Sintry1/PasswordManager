const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

let secret;

const secretPath = path.join(__dirname, "secret.json");

try {
  // Load the secret from a separate file (secret.json)
  if (fs.existsSync(secretPath)) {
    const secretData = fs.readFileSync(secretPath, "utf-8");
    const parsedSecretData = JSON.parse(secretData);
    secret = parsedSecretData.secret;
  }
} catch (error) {
  console.error("Error loading secret:", error);
}

if (!secret) {
  // If the secret.json file doesn't exist or doesn't contain a valid secret, generate a new secret and save it
  secret = crypto.randomBytes(16).toString("hex");
  try {
    // Save the secret to the secret.json file
    fs.writeFileSync(secretPath, JSON.stringify({ secret }), "utf-8");
  } catch (error) {
    console.error("Error saving secret:", error);
  }
}

module.exports = {
  secret,
};
