import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JwtPayload } from '@/types/auth';
import { prisma } from './prisma';
import { PrismaClient } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: any): string => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role = 'STAFF'
): Promise<any> => {
  console.log('Creating user with email:', email);
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);
  
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    }
  });
  
  console.log('User created successfully:', user.id);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const findUserByEmail = async (email: string): Promise<any | null> => {
  console.log('Looking for user with email:', email);
  return prisma.user.findUnique({
    where: { email }
  });
};

export const isFirstUser = async (): Promise<boolean> => {
  const count = await prisma.user.count();
  console.log('Total users:', count);
  return count === 0;
}; 