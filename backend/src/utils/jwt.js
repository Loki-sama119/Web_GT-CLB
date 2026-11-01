import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  return jwt.verify(token, ENV.JWT_SECRET);
};

export const setAuthCookie = (res, token) => {
  const isProduction = ENV.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
  });
};

export const clearAuthCookie = (res) => {
  const isProduction = ENV.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/'
  });
};
