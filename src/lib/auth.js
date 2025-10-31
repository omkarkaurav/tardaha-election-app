import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from .env");
}

export function checkAdminAuth(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return { error: 'Unauthorized: No token provided', status: 401 };
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return { user }; // Success
  } catch (err) {
    return { error: 'Forbidden: Invalid or expired token', status: 403 };
  }
}