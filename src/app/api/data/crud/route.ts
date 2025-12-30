import { NextRequest } from 'next/server';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would verify the token from headers
    // Query all documents from a collection
    const collectionName = request.nextUrl.searchParams.get('collection') || 'items';
    const id = request.nextUrl.searchParams.get('id');
    
    if (id) {
      // Get a specific document by ID
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return new Response(
          JSON.stringify({ id: docSnap.id, ...docSnap.data() }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ error: 'Document not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Get all documents in the collection
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
    }
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

export async function PUT(request: NextRequest) {
  try {
    const collectionName = request.nextUrl.searchParams.get('collection') || 'items';
    const id = request.nextUrl.searchParams.get('id');
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Document ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const data = await request.json();
    const docRef = doc(db, collectionName, id);
    
    await updateDoc(docRef, data);

    return new Response(
      JSON.stringify({ id, ...data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update data error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while updating data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const collectionName = request.nextUrl.searchParams.get('collection') || 'items';
    const id = request.nextUrl.searchParams.get('id');
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Document ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);

    return new Response(
      JSON.stringify({ message: 'Document deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Delete data error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while deleting data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}