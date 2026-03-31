

const jwt = require('jsonwebtoken');// Import the library to verify tokens
const JWT_SECRET = 'your_secret_key'; // The 'key' used to sign and verify tokens (keep this hidden in .env!)

module.exports = (req, res, next) => {

    // 1. Extract the 'Authorization' header from the incoming request.
  // Standard format is: "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];

  // 2. Extract the actual token string.
  // The '&&' checks if authHeader exists, then splits the string by space and takes the second part [1].
  const token = authHeader && authHeader.split(' ')[1];



 // 3. Early Exit: If there is no token at all, stop here.
  // Return 401 Unauthorized so the rest of the code doesn't run.
  if (!token) return res.status(401).json({ message: "No token" });


   // 4. Verification: Check if the token is legitimate and not expired.
  // jwt.verify takes the token, your secret key, and a callback function.
  jwt.verify(token, JWT_SECRET, (err, decoded) => {

    // 5. Error Handling: If the token was tampered with or expired ('err' exists).
    if (err) return res.status(401).json({ message: "Invalid token" });


    // 6. Success: The token is valid! 
    // 'decoded' contains the user data (like userId) that was encoded into the token.
    // We attach it to 'req.user' so that the NEXT function in the chain can use it.
    req.user = decoded;


     // 7. Pass the Baton: Call next() to move to the actual controller/route handler.
    next();
  });
};

