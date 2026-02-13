import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@neondatabase/serverless';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const inspectionId = searchParams.get('inspection_id');
    
    if (!inspectionId) {
      return NextResponse.json({ error: 'inspection_id is required' }, { status: 400 });
    }
    
    const abnormalData = await sql`SELECT * FROM abnormal_data WHERE inspection_id = ${inspectionId} ORDER BY created_at DESC`;
    return NextResponse.json(abnormalData.rows);
  } catch (error) {
    console.error('Error fetching abnormal data:', error);
    return NextResponse.json({ error: 'Failed to fetch abnormal data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const result = await sql`
      INSERT INTO abnormal_data (inspection_id, category_id, item, deviation, description, frequency, duration)
      VALUES (${body.inspection_id}, ${body.category_id}, ${body.item}, ${body.deviation}, ${body.description}, ${body.frequency}, ${body.duration})
      RETURNING *
    `;
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating abnormal data:', error);
    return NextResponse.json({ error: 'Failed to create abnormal data' }, { status: 500 });
  }
}
