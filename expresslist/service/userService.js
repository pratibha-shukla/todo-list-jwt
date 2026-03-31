

const bcrypt = require('bcryptjs'); // Library for hashing passwords
const jwt = require('jsonwebtoken');
const { users } = require('../models');

const JWT_SECRET = 'your_secret_key';

exports.registerUser = async (username, password) => {
  // 1. Hashing: Never store plain-text passwords! 
  // '10' is the saltRounds (cost factor). Higher is more secure but slower.
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = { id: users.length + 1, username, password: hashedPassword };
  users.push(user);
  return user;
};

exports.loginUser = async (username, password) => {
  // 2. Lookup: Find the user by their unique username
  const user = users.find(u => u.username === username);
  
  // 3. Verification: bcrypt.compare takes the plain password from the login form 
  // and compares it to the hashed version in the database.
  if (user && await bcrypt.compare(password, user.password)) {
    
    // 4. Token Generation: If password is correct, sign a JWT.
    // We include 'userId' in the payload so the middleware can identify them later.
    return jwt.sign(
      { userId: user.id, role: 'user' }, 
      JWT_SECRET, 
      { expiresIn: '1h' } // Token expires in 1 hour for security
    );
  }
  
  // 5. Failure: Return null if user isn't found or password is wrong
  return null;
};
