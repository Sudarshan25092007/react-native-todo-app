import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token for a user
 * @param userId - The user's ID to include in the token payload
 * @returns A signed JWT token with 7 days expiry
 */
export const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    { userId },
    jwtSecret,
    { expiresIn: '7d' }
  );
};

