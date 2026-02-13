import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@neondatabase/serverless';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const inspectionId = searchParams.get('inspection_id');
    
    if (!inspectionId) {
      return NextResponse.json({ error: 'inspection_id is required' }, { status: 400 });
    }
    
    const photos = await sql`SELECT * FROM photos WHERE inspection_id = ${inspectionId} ORDER BY created_at DESC`;
    return NextResponse.json(photos.rows);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const result = await sql`
      INSERT INTO photos (inspection_id, description, image_base64)
      VALUES (${body.inspection_id}, ${body.description}, ${body.image_base64})
      RETURNING *
    `;
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json({ error: 'Failed to create photo' }, { status: 500 });
  }
}
