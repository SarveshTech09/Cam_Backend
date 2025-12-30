import { NextRequest } from 'next/server';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would verify the token from headers
    // For now, returning basic user info if authenticated
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get additional user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const userData = userDoc.data();

    return new Response(
      JSON.stringify({ 
        id: currentUser.uid, 
        email: currentUser.email,
        emailVerified: currentUser.emailVerified,
        displayName: currentUser.displayName,
        name: userData?.name || currentUser.displayName
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while fetching user data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { displayName, photoURL, name } = await request.json();

    // Update Firebase Auth profile
    await updateProfile(currentUser, {
      displayName: name || displayName,
    });

    // Update Firestore user document
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // Update existing user document
      await updateDoc(userRef, {
        ...(name && { name }),
        ...(photoURL && { photoURL }),
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Create new user document if it doesn't exist
      await setDoc(userRef, {
        name: name || displayName,
        email: currentUser.email,
        photoURL,
        createdAt: new Date().toISOString(),
      });
    }

    return new Response(
      JSON.stringify({ 
        message: 'Profile updated successfully',
        id: currentUser.uid,
        email: currentUser.email,
        name: name || displayName
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update user error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while updating user data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}