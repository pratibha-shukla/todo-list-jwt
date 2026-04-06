const jwt = require('jsonwebtoken');
const userService = require('../userService');
const { users } = require('../../models');

describe('userService', () => {
  beforeEach(() => {
    users.length = 0;
  });

  describe('registerUser', () => {
    it('creates a user with a trimmed username', async () => {
      const result = await userService.registerUser('  alice  ', 'secret1');

      expect(result).toEqual({
        status: 201,
        data: {
          id: 1,
          username: 'alice'
        }
      });
      expect(users).toHaveLength(1);
      expect(users[0].username).toBe('alice');
      expect(users[0].password).not.toBe('secret1');
    });

    it('rejects duplicate usernames', async () => {
      await userService.registerUser('alice', 'secret1');

      const result = await userService.registerUser('alice', 'secret2');

      expect(result).toEqual({
        status: 409,
        message: 'Username already exists'
      });
      expect(users).toHaveLength(1);
    });

    it('rejects short passwords', async () => {
      const result = await userService.registerUser('alice', '123');

      expect(result).toEqual({
        status: 400,
        message: 'Password must be at least 6 characters long'
      });
    });
  });

  describe('loginUser', () => {
    it('returns a token and public user data for valid credentials', async () => {
      await userService.registerUser('alice', 'secret1');

      const result = await userService.loginUser('alice', 'secret1');
      const decoded = jwt.decode(result.data.accessToken);

      expect(result.status).toBe(200);
      expect(result.data.user).toEqual({
        id: 1,
        username: 'alice'
      });
      expect(result.data.refreshToken).toEqual(expect.any(String));
      expect(decoded).toMatchObject({
        userId: 1,
        username: 'alice',
        role: 'user'
      });
    });

    it('rejects invalid credentials', async () => {
      await userService.registerUser('alice', 'secret1');

      const result = await userService.loginUser('alice', 'wrongpass');

      expect(result).toEqual({
        status: 401,
        message: 'Invalid credentials'
      });
    });

    it('rejects missing credentials', async () => {
      const result = await userService.loginUser('', '');

      expect(result).toEqual({
        status: 400,
        message: 'Username and password are required'
      });
    });
  });

  describe('refreshUserToken', () => {
    it('rotates refresh tokens and returns a new access token', async () => {
      await userService.registerUser('alice', 'secret1');
      const loginResult = await userService.loginUser('alice', 'secret1');

      const refreshResult = await userService.refreshUserToken(loginResult.data.refreshToken);

      expect(refreshResult.status).toBe(200);
      expect(refreshResult.data.user).toEqual({
        id: 1,
        username: 'alice'
      });
      expect(refreshResult.data.accessToken).toEqual(expect.any(String));
      expect(refreshResult.data.refreshToken).toEqual(expect.any(String));
      expect(refreshResult.data.refreshToken).not.toBe(loginResult.data.refreshToken);
      expect(users[0].refreshTokens).toHaveLength(1);
    });

    it('rejects an unknown refresh token', async () => {
      const result = await userService.refreshUserToken('not-a-real-token');

      expect(result).toEqual({
        status: 401,
        message: 'Invalid refresh token'
      });
    });
  });
});
