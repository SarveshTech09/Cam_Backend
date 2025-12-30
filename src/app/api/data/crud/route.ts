import { NextRequest } from 'next/server';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would verify the token from headers
    // Query all documents from a collection
    const collectionName = request.nextUrl.searchParams.get('collection') || 'items';
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);

    const items: any[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });

    return new Response(
      JSON.stringify(items),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get data error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while fetching data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const collectionName = request.nextUrl.searchParams.get('collection') || 'items';
    const data = await request.json();

    const docRef = await addDoc(collection(db, collectionName), data);

    return new Response(
      JSON.stringify({ id: docRef.id, ...data }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Create data error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while creating data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}