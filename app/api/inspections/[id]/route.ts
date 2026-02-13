import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@neondatabase/serverless';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inspection = await sql`SELECT * FROM inspections WHERE id = ${params.id}`;
    
    if (inspection.rows.length === 0) {
      return NextResponse.json({ error: 'Inspection not found' }, { status: 404 });
    }
    
    return NextResponse.json(inspection.rows[0]);
  } catch (error) {
    console.error('Error fetching inspection:', error);
    return NextResponse.json({ error: 'Failed to fetch inspection' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    
    const result = await sql`
      UPDATE inspections 
      SET 
        equipment_id = COALESCE(${body.equipment_id}, equipment_id),
        location = COALESCE(${body.location}, location),
        shift = COALESCE(${body.shift}, shift),
        date = COALESCE(${body.date}, date),
        inspector_name = COALESCE(${body.inspector_name}, inspector_name),
        status = COALESCE(${body.status}, status),
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `;
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Inspection not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating inspection:', error);
    return NextResponse.json({ error: 'Failed to update inspection' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete related data first
    await sql`DELETE FROM categories WHERE inspection_id = ${params.id}`;
    await sql`DELETE FROM abnormal_data WHERE inspection_id = ${params.id}`;
    await sql`DELETE FROM five_m WHERE inspection_id = ${params.id}`;
    await sql`DELETE FROM photos WHERE inspection_id = ${params.id}`;
    await sql`DELETE FROM maintenance_records WHERE inspection_id = ${params.id}`;
    
    // Delete the inspection
    const result = await sql`DELETE FROM inspections WHERE id = ${params.id} RETURNING *`;
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Inspection not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Inspection deleted successfully' });
  } catch (error) {
    console.error('Error deleting inspection:', error);
    return NextResponse.json({ error: 'Failed to delete inspection' }, { status: 500 });
  }
}
