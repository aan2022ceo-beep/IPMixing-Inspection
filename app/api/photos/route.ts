import { NextRequest, NextResponse } from 'next/server';
import { getPhotos, createPhoto } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const inspectionId = searchParams.get('inspection_id');
    
    if (!inspectionId) {
      return NextResponse.json({ error: 'inspection_id is required' }, { status: 400 });
    }
    
    const photos = await getPhotos(inspectionId);
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const photo = await createPhoto(body);
    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json({ error: 'Failed to create photo' }, { status: 500 });
  }
}
