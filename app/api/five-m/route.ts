import { NextRequest, NextResponse } from 'next/server';
import { getFiveM, createFiveM } from '@/lib/db';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const inspectionId = searchParams.get('inspection_id');
    
    if (!inspectionId) {
      return NextResponse.json({ error: 'inspection_id is required' }, { status: 400 });
    }
    
    const fiveM = await getFiveM(inspectionId);
    return NextResponse.json(fiveM);
  } catch (error) {
    console.error('Error fetching 5M analysis:', error);
    return NextResponse.json({ error: 'Failed to fetch 5M analysis' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const analysis = await createFiveM(body);
    return NextResponse.json(analysis, { status: 201 });
  } catch (error) {
    console.error('Error creating 5M analysis:', error);
    return NextResponse.json({ error: 'Failed to create 5M analysis' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const client = await pool.connect();
  try {
    const body = await req.json();
    
    const result = await client.query(
      `UPDATE five_m 
       SET man = $1, method = $2, machine = $3, material = $4, environment = $5, immediate_action = $6
       WHERE inspection_id = $7
       RETURNING *`,
      [body.man, body.method, body.machine, body.material, body.environment, body.immediate_action, body.inspection_id]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating 5M analysis:', error);
    return NextResponse.json({ error: 'Failed to update 5M analysis' }, { status: 500 });
  } finally {
    client.release();
  }
}
