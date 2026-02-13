import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@neondatabase/serverless';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const inspectionId = searchParams.get('inspection_id');
    
    if (!inspectionId) {
      return NextResponse.json({ error: 'inspection_id is required' }, { status: 400 });
    }
    
    const categories = await sql`SELECT * FROM categories WHERE inspection_id = ${inspectionId} ORDER BY created_at DESC`;
    return NextResponse.json(categories.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const result = await sql`
      INSERT INTO categories (inspection_id, name, level)
      VALUES (${body.inspection_id}, ${body.name}, ${body.level})
      RETURNING *
    `;
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
