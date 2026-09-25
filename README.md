# Electrical Club Certificate Automation System

A complete, modern, production-ready web application for generating and emailing certificates for the Electrical Club.

## Features

- **Event Management**: Create and manage events
- **Certificate Template Editor**: Upload any PNG/JPG/PDF template and place fields visually via drag and drop
- **Excel Data Source**: Download an Excel template and upload participant details in bulk
- **PDF Generation**: Certificates are generated as separate high-quality PDFs
- **Bulk Email Sending**: Automatic emailing of certificates to participants with customizable templates
- **Dashboard & History**: Track statistics, successful emails, and failures with a retry mechanism
- **Security**: Authentication, secure configuration, and local file storage

## Technology Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite with Prisma ORM
- **Processing**: Multer, XLSX, PDF-Lib, Nodemailer

## Development Setup

1. **Backend**:
   ```bash
   cd backend
   npm install
   npx prisma db push
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Environment Variables

### Backend `.env`

```
DATABASE_URL="file:./dev.db"
PORT=5000
JWT_SECRET="supersecretjwtkey_for_electrical_club"

# SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="your-email@gmail.com"
SMTP_FROM_NAME="Electrical Club"
```

## Production Build

### Frontend
```bash
cd frontend
npm run build
```
The output will be in `frontend/dist`.

### Backend
```bash
cd backend
npm run build
npm start
```
