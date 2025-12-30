import { NextRequest } from 'next/server';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save additional user data to Firestore
    if (name) {
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email: user.email,
        createdAt: new Date().toISOString(),
      });
    }

    return new Response(
      JSON.stringify({ 
        id: user.uid, 
        email: user.email,
        name
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Sign up error:', error);
    
    let message = 'An error occurred during sign up';
    if (error.code === 'auth/email-already-in-use') {
      message = 'Email is already in use';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email format';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password is too weak';
    }

    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}