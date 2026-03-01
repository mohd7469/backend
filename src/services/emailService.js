/**
 * Email Service
 * Handles all email sending operations for the application
 * Currently logs to console; replace with nodemailer/SendGrid/AWS SES as needed
 */

// In production, configure with actual email provider:
// import nodemailer from 'nodemailer';
// const transporter = nodemailer.createTransport({ ... });

import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const EMAIL_FROM = env.EMAIL_FROM || 'noreply@example.com';

// Create transporter if SMTP config is present. Falls back to console logging when not configured.
let transporter = null;
const createTransporter = () => {
  try {
    const options = {
      host: env.EMAIL_HOST,
      // service: process.env.SERVICE, //comment this line if you use custom server/domain
      port: Number(env.EMAIL_PORT),
      secure: (env.EMAIL_SECURE === 'true') || Number(env.EMAIL_PORT) === 465,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    };

    return nodemailer.createTransport(options);
  } catch (err) {
    console.error('❌ [EMAIL TRANSPORT ERROR]', err);
    return null;
  }
};

transporter = createTransporter();

/**
 * Send verification OTP email
 * @param {string} email - recipient email
 * @param {string} otp - one-time password
 */
export const sendVerificationOtpEmail = async (email, otp) => {
  const subject = 'Email Verification Code';
  const html = `
    <h2>Email Verification</h2>
    <p>Your verification code is:</p>
    <h1 style="color: #007bff; letter-spacing: 2px;">${otp}</h1>
    <p>This code expires in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return sendEmail(email, subject, html);
};

/**
 * Send password reset OTP email
 * @param {string} email - recipient email
 * @param {string} otp - one-time password
 */
export const sendPasswordResetLink = async (email, token) => {
  const BASE = env.FRONTEND_URL;
  const expiryMinutes = env.LINK_AND_OTP_EXPIRY_MINUTES;
  const link = `${BASE.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
  const subject = 'Password Reset Link';
  const html = `
    <h2>Password Reset Request</h2>
    <p>Click the link below to reset your password. This link expires in ${expiryMinutes} minute(s).</p>
    <p><a href="${link}">Reset your password</a></p>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `;

  return sendEmail(email, subject, html);
};


/**
 * Send welcome email to new user
 * @param {string} email - recipient email
 * @param {string} name - user's name
 */
export const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome!';
  const html = `
    <h2>Welcome, ${name}!</h2>
    <p>Thank you for signing up. Your account is ready to use.</p>
    <p>If you have any questions, feel free to reach out to our support team.</p>
  `;

  return sendEmail(email, subject, html);
};

/**
 * Generic email sender
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} html - email body (HTML)
 */
const sendEmail = async (to, subject, html) => {
  // If transporter is not configured, fallback to console logging
  if (!transporter) {
    console.log(`📧 [EMAIL - fallback] From: ${EMAIL_FROM}`);
    console.log(`📧 [EMAIL - fallback] To: ${to}`);
    console.log(`📧 [EMAIL - fallback] Subject: ${subject}`);
    console.log(`📧 [EMAIL - fallback] Body:\n${html}\n`);
    return { success: true, messageId: `mock-${Date.now()}` };
  }

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });

    return { success: true, messageId: info.messageId || info.response, raw: info };
  } catch (err) {
    console.error('❌ [EMAIL ERROR]', err);
    // rethrow so callers may handle failures
    throw err;
  }
};

export default {
  sendVerificationOtpEmail,
  sendPasswordResetLink,
  sendWelcomeEmail,
  sendEmail,
};
