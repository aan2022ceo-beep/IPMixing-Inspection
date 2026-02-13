import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@neondatabase/serverless';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const inspectionId = searchParams.get('inspection_id');
    
    if (!inspectionId) {
      return NextResponse.json({ error: 'inspection_id is required' }, { status: 400 });
    }
    
    const fiveM = await sql`SELECT * FROM five_m WHERE inspection_id = ${inspectionId}`;
    return NextResponse.json(fiveM.rows);
  } catch (error) {
    console.error('Error fetching 5M analysis:', error);
    return NextResponse.json({ error: 'Failed to fetch 5M analysis' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const result = await sql`
      INSERT INTO five_m (inspection_id, man, method, machine, material, environment, immediate_action)
      VALUES (${body.inspection_id}, ${body.man}, ${body.method}, ${body.machine}, ${body.material}, ${body.environment}, ${body.immediate_action})
      RETURNING *
    `;
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating 5M analysis:', error);
    return NextResponse.json({ error: 'Failed to create 5M analysis' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    const result = await sql`
      UPDATE five_m 
      SET 
        man = COALESCE(${body.man}, man),
        method = COALESCE(${body.method}, method),
        machine = COALESCE(${body.machine}, machine),
        material = COALESCE(${body.material}, material),
        environment = COALESCE(${body.environment}, environment),
        immediate_action = COALESCE(${body.immediate_action}, immediate_action)
      WHERE inspection_id = ${body.inspection_id}
      RETURNING *
    `;
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating 5M analysis:', error);
    return NextResponse.json({ error: 'Failed to update 5M analysis' }, { status: 500 });
  }
}
