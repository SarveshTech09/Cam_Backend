# Cam Backend

This is the backend for the Cam application, built with Next.js and Firebase.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file based on `.env.example` and add your Firebase configuration
4. Run the development server:
   ```bash
   npm run dev
   ```

## API Routes

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/user/profile` - Get user profile (requires authentication)
- `PUT /api/user/profile` - Update user profile (requires authentication)
- `GET /api/data/crud?collection=items` - Get data from a collection
- `POST /api/data/crud?collection=items` - Create data in a collection

## Firebase Integration

This backend uses Firebase for:
- Authentication
- Firestore database
- Real-time data synchronization

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

## Deployment

To build and run for production:

```bash
npm run build
npm start
```