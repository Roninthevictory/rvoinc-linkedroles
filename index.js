// Loads the secure backend logic from a Codespaces secret
const fs = require("fs");
const secret = process.env.RVO_SECURE_CODE;

// dynamically write the secret code into memory
eval(secret);

// The secret now runs in-memory, not stored on disk
