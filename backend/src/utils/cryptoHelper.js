const crypto = require("crypto");

// Encrypt song ID into a shorter string (can be used for URL)
const encryptId = (id, title) => {
  const cipher = crypto.createCipher("aes-256-cbc", "your-secret-key"); // Replace 'your-secret-key' with your secret key
  let encrypted = cipher.update(id + title, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// Decrypt ID from URL to get back the song ID
const decryptId = (encrypted, title) => {
  const decipher = crypto.createDecipher("aes-256-cbc", "your-secret-key");
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  const [songId] = decrypted.split(title); // Split ID from song title
  return songId;
};

module.exports = { encryptId, decryptId };
