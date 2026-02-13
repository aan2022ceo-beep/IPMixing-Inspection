import { NextRequest, NextResponse } from 'next/server';
import { getInspectionById, updateInspection, deleteInspection } from '@/lib/db';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inspection = await getInspectionById(params.id);
    
    if (!inspection) {
      return NextResponse.json({ error: 'Inspection not found' }, { status: 404 });
    }
    
    return NextResponse.json(inspection);
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
    const inspection = await updateInspection(params.id, body);
    
    if (!inspection) {
      return NextResponse.json({ error: 'Inspection not found' }, { status: 404 });
    }
    
    return NextResponse.json(inspection);
  } catch (error) {
    console.error('Error updating inspection:', error);
    return NextResponse.json({ error: 'Failed to update inspection' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();
  try {
    // Delete related data first (cascade delete)
    await client.query('DELETE FROM categories WHERE inspection_id = $1', [params.id]);
    await client.query('DELETE FROM abnormal_data WHERE inspection_id = $1', [params.id]);
    await client.query('DELETE FROM five_m WHERE inspection_id = $1', [params.id]);
    await client.query('DELETE FROM photos WHERE inspection_id = $1', [params.id]);
    await client.query('DELETE FROM maintenance_records WHERE inspection_id = $1', [params.id]);
    
    // Delete the inspection
    const result = await client.query('DELETE FROM inspections WHERE id = $1 RETURNING *', [params.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Inspection not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Inspection deleted successfully' });
  } catch (error) {
    console.error('Error deleting inspection:', error);
    return NextResponse.json({ error: 'Failed to delete inspection' }, { status: 500 });
  } finally {
    client.release();
  }
}
