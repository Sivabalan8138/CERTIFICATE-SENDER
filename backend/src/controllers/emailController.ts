import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { prisma } from '../lib/prisma';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendCertificateEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, subject, body, imageData } = req.body;

    if (!email || !imageData) {
      res.status(400).json({ error: 'Missing email or image data' });
      return;
    }

    // Convert base64 image data to buffer
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: subject || 'Your Certificate',
      text: body || `Dear ${name},\n\nPlease find your certificate attached.\n\nRegards,\nElectrical Club`,
      attachments: [
        {
          filename: `${name.replace(/\s+/g, '_')}_Certificate.png`,
          content: buffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    // Since participants are currently stored in localStorage in the frontend,
    // we skip logging to the database to prevent foreign key errors.
    
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};
