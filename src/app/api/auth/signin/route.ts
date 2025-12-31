import { NextRequest } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log('Sign in request received:', { email, password: password ? '[PROVIDED]' : '[NOT PROVIDED]' });

    if (!email || !password) {
      console.error('Sign in validation error: Missing email or password');
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

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed in successfully:', user.uid);
    
    // Get the Firebase ID token to send to the client
    const idToken = await user.getIdToken();
    console.log('Token generated for user:', user.uid);

    return new Response(
      JSON.stringify({ 
        id: user.uid, 
        email: user.email,
        name: user.displayName || '',
        token: idToken  // Send the token to the client
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        } 
      }
    );
  } catch (error: any) {
    console.error('Sign in error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    let message = 'An error occurred during sign in';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      message = 'Invalid email or password';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email format';
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