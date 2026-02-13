import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@neondatabase/serverless';

export async function GET() {
  try {
    const inspections = await sql`SELECT * FROM inspections ORDER BY created_at DESC`;
    return NextResponse.json(inspections.rows);
  } catch (error) {
    console.error('Error fetching inspections:', error);
    return NextResponse.json({ error: 'Failed to fetch inspections' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const result = await sql`
      INSERT INTO inspections (
        equipment_id, location, shift, date, inspector_name, status
      ) VALUES (
        ${body.equipment_id},
        ${body.location},
        ${body.shift},
        ${body.date},
        ${body.inspector_name},
        ${body.status || 'Open'}
      )
      RETURNING *
    `;
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating inspection:', error);
    return NextResponse.json({ error: 'Failed to create inspection' }, { status: 500 });
  }
}
