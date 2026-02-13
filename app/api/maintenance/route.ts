import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@neondatabase/serverless';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const inspectionId = searchParams.get('inspection_id');
    
    if (!inspectionId) {
      return NextResponse.json({ error: 'inspection_id is required' }, { status: 400 });
    }
    
    const maintenance = await sql`SELECT * FROM maintenance_records WHERE inspection_id = ${inspectionId} ORDER BY created_at DESC`;
    return NextResponse.json(maintenance.rows);
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    return NextResponse.json({ error: 'Failed to fetch maintenance records' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const result = await sql`
      INSERT INTO maintenance_records (inspection_id, task, priority, assigned_to, status, due_date, completion_date, notes)
      VALUES (${body.inspection_id}, ${body.task}, ${body.priority}, ${body.assigned_to}, ${body.status || 'Open'}, ${body.due_date}, ${body.completion_date}, ${body.notes})
      RETURNING *
    `;
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating maintenance record:', error);
    return NextResponse.json({ error: 'Failed to create maintenance record' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    const result = await sql`
      UPDATE maintenance_records 
      SET 
        task = COALESCE(${body.task}, task),
        priority = COALESCE(${body.priority}, priority),
        assigned_to = COALESCE(${body.assigned_to}, assigned_to),
        status = COALESCE(${body.status}, status),
        due_date = COALESCE(${body.due_date}, due_date),
        completion_date = COALESCE(${body.completion_date}, completion_date),
        notes = COALESCE(${body.notes}, notes)
      WHERE id = ${body.id}
      RETURNING *
    `;
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating maintenance record:', error);
    return NextResponse.json({ error: 'Failed to update maintenance record' }, { status: 500 });
  }
}
