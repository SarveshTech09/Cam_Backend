import { NextRequest } from 'next/server';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    console.log('Sign up request received:', { email, name });

    if (!email || !password) {
      console.error('Sign up validation error: Missing email or password');
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          } 
        }
      );
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User created successfully:', user.uid);

    // Get the Firebase ID token to send to the client
    const idToken = await user.getIdToken();
    console.log('Token generated for new user:', user.uid);

    // Save additional user data to Firestore
    if (name) {
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email: user.email,
        createdAt: new Date().toISOString(),
      });
      console.log('User data saved to Firestore:', user.uid);
    }

    return new Response(
      JSON.stringify({ 
        id: user.uid, 
        email: user.email,
        name,
        token: idToken  // Send the token to the client
      }),
      { 
        status: 201, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        } 
      }
    );
  } catch (error: any) {
    console.error('Sign up error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    let message = 'An error occurred during sign up';
    if (error.code === 'auth/email-already-in-use') {
      message = 'Email is already in use';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email format';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password is too weak';
    } else {
      // More specific error message for debugging
      message = error.message || message;
    }

    return new Response(
      JSON.stringify({ error: message }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        } 
      }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}