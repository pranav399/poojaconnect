import express from 'express';
import { randomInt } from 'crypto';
import path from 'path';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const configuredPort = Number(process.env.PORT || 3000);
if (!Number.isInteger(configuredPort) || configuredPort < 1 || configuredPort > 65535) {
  throw new Error(`Invalid PORT value "${process.env.PORT}". PORT must be an integer between 1 and 65535.`);
}
const PORT = configuredPort;

app.use(express.json({ limit: '16kb' }));

// In-Memory Store for OTPs
// Structure: Map<email, { code: string; expiresAt: number; attempts: number }>
interface OTPRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  nextAllowedAt: number;
}

const otpStore = new Map<string, OTPRecord>();

// Use configured delivery providers; only simulate delivery in local development.
async function dispatchOTPEmail(email: string, otpCode: string): Promise<{ method: string; simulated: boolean }> {
  const sendgridKey = process.env.SENDGRID_API_KEY;
  const sendgridFrom = process.env.SENDGRID_FROM_EMAIL;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM_EMAIL;
  const deliveryErrors: string[] = [];
  const hasAnySmtpConfig = Boolean(smtpHost || process.env.SMTP_PORT || smtpUser || smtpPass || smtpFrom);
  const hasAnySendgridConfig = Boolean(sendgridKey || sendgridFrom);

  const emailSubject = 'Your PoojaConnect Verification Code';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #d97706; margin: 0; font-size: 24px;">PoojaConnect</h2>
        <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Sacred Vedic Services & Samagri</p>
      </div>
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px; font-weight: 600;">YOUR ONE-TIME PASSCODE (OTP)</p>
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #b45309;">${otpCode}</span>
        <p style="margin: 10px 0 0 0; color: #b45309; font-size: 12px;">Valid for 10 minutes. Do not share this code with anyone.</p>
      </div>
      <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">
        You requested this verification code to access your PoojaConnect account. If you did not request this email, please ignore it.
      </p>
      <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 20px 0;" />
      <p style="color: #9ca3af; font-size: 11px; text-align: center;">
        © ${new Date().getFullYear()} PoojaConnect. Har Har Mahadev 🙏
      </p>
    </div>
  `;

  // SMTP Nodemailer (Mailtrap / Custom SMTP)
  if (smtpHost && smtpUser && smtpPass && smtpFrom) {
    if (!Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) {
      deliveryErrors.push('SMTP_PORT must be an integer between 1 and 65535.');
    } else {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });
        await transporter.sendMail({
          from: smtpFrom,
          to: email,
          subject: emailSubject,
          html: emailHtml,
        });
        console.log(`[SMTP] OTP email sent successfully to ${email}`);
        return { method: 'SMTP', simulated: false };
      } catch {
        deliveryErrors.push('SMTP delivery failed. Check SMTP_HOST, SMTP_PORT, credentials, and sender address.');
      }
    }
  } else if (hasAnySmtpConfig) {
    deliveryErrors.push('SMTP configuration is incomplete. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM_EMAIL.');
  }

  // SendGrid API (Alternative)
  if (sendgridKey && sendgridFrom) {
    try {
      sgMail.setApiKey(sendgridKey);
      await sgMail.send({
        to: email,
        from: sendgridFrom,
        subject: emailSubject,
        html: emailHtml,
      });
      console.log(`[SendGrid] OTP email sent successfully to ${email}`);
      return { method: 'SendGrid', simulated: false };
    } catch {
      deliveryErrors.push('SendGrid delivery failed. Check SENDGRID_API_KEY and verify SENDGRID_FROM_EMAIL.');
    }
  } else if (hasAnySendgridConfig) {
    deliveryErrors.push('SendGrid configuration is incomplete. Set both SENDGRID_API_KEY and SENDGRID_FROM_EMAIL.');
  }

  if (deliveryErrors.length > 0) {
    throw new Error(deliveryErrors.join(' '));
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[OTP development simulation] No email provider configured for ${email}.`);
    return { method: 'Development simulation', simulated: true };
  }

  throw new Error('Email delivery is not configured. Set SMTP_* or SENDGRID_API_KEY and SENDGRID_FROM_EMAIL.');
}

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Send OTP Route
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body ?? {};
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingRecord = otpStore.get(normalizedEmail);
    if (existingRecord && Date.now() < existingRecord.nextAllowedAt) {
      return res.status(429).json({
        success: false,
        message: 'Please wait before requesting another verification code.',
      });
    }

    const otpCode = randomInt(100000, 1000000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    const dispatchResult = await dispatchOTPEmail(normalizedEmail, otpCode);
    otpStore.set(normalizedEmail, {
      code: otpCode,
      expiresAt,
      attempts: 0,
      nextAllowedAt: Date.now() + 60 * 1000,
    });

    return res.json({
      success: true,
      message: dispatchResult.simulated
        ? 'Email delivery is not configured. Use the development-only code shown below.'
        : `Verification code sent to ${normalizedEmail}.`,
      deliveryMethod: dispatchResult.method,
      simulated: dispatchResult.simulated,
      simulatedOtp: dispatchResult.simulated ? otpCode : undefined,
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send OTP email.',
    });
  }
});

// Verify OTP Route
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body ?? {};

    if (typeof email !== 'string' || typeof otp !== 'string' || !email.trim() || !/^\d{6}$/.test(otp.trim())) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const record = otpStore.get(normalizedEmail);

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'No OTP requested for this email or code has expired. Please click "Resend OTP".',
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new verification code.',
      });
    }

    record.attempts += 1;

    if (record.code !== otp.trim()) {
      if (record.attempts >= 5) {
        otpStore.delete(normalizedEmail);
        return res.status(400).json({
          success: false,
          message: 'Too many failed attempts. Please request a new OTP code.',
        });
      }
      return res.status(400).json({
        success: false,
        message: `Invalid OTP code. You have ${5 - record.attempts} attempts remaining.`,
      });
    }

    // Success - clear OTP
    otpStore.delete(normalizedEmail);

    return res.json({
      success: true,
      message: 'OTP code verified successfully!',
      email: normalizedEmail,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Verification failed. Please try again.',
    });
  }
});

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    const hasSendgrid = Boolean(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL);
    const hasSmtp = Boolean(
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM_EMAIL
    );
    if (!hasSendgrid && !hasSmtp) {
      throw new Error('Production requires SendGrid or SMTP email configuration. Set provider credentials in the deployment environment.');
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n==================================================`);
    console.log(`[PoojaConnect Server] Ready for Localhost & Cloud`);
    console.log(`> Local:   http://localhost:${PORT}`);
    console.log(`> Network: http://0.0.0.0:${PORT}`);
    console.log(`==================================================\n`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer().catch((error: unknown) => {
    console.error('Server startup failed:', error);
    process.exitCode = 1;
  });
}
