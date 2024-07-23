import pool from './db';
import bcrypt from 'bcrypt';

interface User {
  id: number;
  email: string;
  password: string;
  fullName: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error retrieving user by email:', error);
    return null;
  }
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}
