# PoojaConnect

PoojaConnect is a Vite/React frontend served by an Express Node.js server. The same server handles `/api` routes and serves the built single-page app in production.

## Requirements

- Node.js 20 or later
- npm

## Local development

```sh
npm ci
cp .env.example .env
npm run dev
```

The development server is available at `http://localhost:3000`. With no mail provider configured, OTP delivery is simulated locally and the code is shown in the login UI.

## Build and run production locally

```sh
npm ci
npm run check
NODE_ENV=production SENDGRID_API_KEY=your-key SENDGRID_FROM_EMAIL=verified@example.com npm start
```

Build first with `npm run build` before `npm start`. Production startup requires a configured email provider. Use deployment environment variables for secrets; do not commit a `.env` file.

## Container deployment

Build and run the production image:

```sh
docker build -t poojaconnect .
docker run --rm -p 3000:3000 \
  -e NODE_ENV=production \
  -e SENDGRID_API_KEY=your-key \
  -e SENDGRID_FROM_EMAIL=verified@example.com \
  poojaconnect
```

The server listens on `0.0.0.0` and honors the hosting provider's `PORT`. Configure the provider's health check to use `GET /api/health`. For a different Firebase web app, supply the `VITE_FIREBASE_*` values at image build time; Vite embeds those values in the frontend bundle. The default Firebase web configuration comes from `firebase-applet-config.json`.

## Deploy to Vercel

1. Import this repository into Vercel and keep the project root at the repository root. `vercel.json` configures the frontend build and SPA route rewrites.
2. Add either `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL` or the SMTP settings below under **Project Settings → Environment Variables** for Production (and Preview if needed). For Mailtrap Email Sandbox, use `SMTP_HOST=sandbox.smtp.mailtrap.io`, `SMTP_PORT=2525`, your Mailtrap sandbox username and password, and a sender such as `PoojaConnect <from@example.com>`.
3. Deploy. Vercel serves the Vite output as static assets and runs the exported Express app for API requests. Google sign-in also requires enabling Google in Firebase Authentication and adding the Vercel domain to Firebase's authorized domains.

For a different Firebase web app, configure the `VITE_FIREBASE_*` variables as Vercel build environment variables and redeploy. Vite embeds these values into the built frontend.

## Enable Google Sign-In

In the Firebase project used by the app, enable **Google** under **Authentication → Sign-in method** and add the deployed hostname under **Authentication → Settings → Authorized domains**. Also add local `localhost` for development.

## Email OTP

OTP email is handled by the Node server, not Firebase Authentication. Configure SendGrid with `SENDGRID_API_KEY` and a verified `SENDGRID_FROM_EMAIL`, or configure SMTP with `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM_EMAIL`. SendGrid is tried after SMTP if both are fully configured. The `.env.example` defaults to Mailtrap Email Sandbox for local testing; sandbox messages are captured in Mailtrap and are not delivered to real recipients. Use a production email provider for real user delivery.

## Deployment scope and production limitations

This repository currently runs its application database and non-Google user accounts in browser `localStorage`. OTP records are stored in server memory. Consequently, this Vercel deployment is suitable for a preview/demo, not a production service with reliable shared user data: browser data is isolated per device, and serverless function instances do not guarantee shared OTP state. Production use requires migrating application data and accounts to a persistent backend (for example Firestore with server-enforced authorization) and storing OTP records in a shared datastore with rate limiting.

The current app's business data adapter does not use Firestore. Review and configure Firebase Authentication and database security rules for the actual data model before storing production user or business data in Firebase.
