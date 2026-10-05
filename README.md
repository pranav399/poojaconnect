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

1. Import this repository into Vercel and keep the project root at the repository root. `vercel.json` configures the frontend build and SPA route rewrites; `api/[...path].ts` exposes the Express OTP endpoints as a Vercel Function.
2. Add either `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL` or the SMTP settings below under **Project Settings → Environment Variables** for Production (and Preview if needed). For Mailtrap Email Sandbox, use `SMTP_HOST=sandbox.smtp.mailtrap.io`, `SMTP_PORT=2525`, your Mailtrap sandbox username and password, and a sender such as `PoojaConnect <from@example.com>`.
3. Deploy. Vercel serves the Vite output as static assets and routes OTP API requests through the Express app. Google sign-in also requires enabling Google in Firebase Authentication and adding the Vercel domain to Firebase's authorized domains.

For a different Firebase web app, configure the `VITE_FIREBASE_*` variables as Vercel build environment variables and redeploy. Vite embeds these values into the built frontend.

## Enable Google Sign-In

In the Firebase project used by the app, enable **Google** under **Authentication → Sign-in method** and add the deployed hostname under **Authentication → Settings → Authorized domains**. Also add local `localhost` for development.

## Shared Samagri catalog and image uploads

The Samagri shop catalog is stored in Firestore, and uploaded product images are stored in Firebase Storage. Deploy the included rules from an authenticated Firebase CLI session:

```sh
npx firebase-tools deploy --only firestore:rules,storage
```

Enable Firestore and Storage in the `poojaconnect-9935f` Firebase project first if either service is not already enabled. For each administrator, have them sign in once with Google, then use **Firebase Console → Firestore Database → profiles** to set that signed-in user's profile document `role` to `admin`. The document ID must be the user's Firebase Authentication UID. Admins must use Google sign-in for catalog edits and image uploads; email/password and OTP sessions are local demo accounts and cannot write shared catalog data.

On the first admin visit to the shared catalog, if Firestore has no products yet, the app imports that browser's existing local product catalog (including image URLs) or the default products. Later edits are shared across visitors. Product image uploads are limited to 5 MB.

## Email OTP

OTP email is handled by the Node server, not Firebase Authentication. Configure SendGrid with `SENDGRID_API_KEY` and a verified `SENDGRID_FROM_EMAIL`, or configure SMTP with `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM_EMAIL`. SendGrid is tried after SMTP if both are fully configured. The `.env.example` defaults to Mailtrap Email Sandbox for local testing; sandbox messages are captured in Mailtrap and are not delivered to real recipients. Use a production email provider for real user delivery.

## Deployment scope and production limitations

This repository still runs most application data and non-Google user accounts in browser `localStorage`. The Samagri product catalog is shared through Firestore and Firebase Storage when their rules are deployed and administrators use Google sign-in. OTP records are stored in server memory. Consequently, this Vercel deployment is suitable for a preview/demo, not a production service with reliable shared user data: browser data is isolated per device, and serverless function instances do not guarantee shared OTP state. Production use requires migrating the remaining application data and accounts to persistent services and storing OTP records in a shared datastore with rate limiting.

Other business data still uses the local demo adapter. Review and configure Firebase Authentication and security rules for that data model before storing production user or business data in Firebase.
