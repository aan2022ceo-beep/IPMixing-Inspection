import { NextRequest, NextResponse } from 'next/server';
import { getMaintenanceRecords, createMaintenanceRecord, updateMaintenanceRecord } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const inspectionId = searchParams.get('inspection_id');
    
    if (!inspectionId) {
      return NextResponse.json({ error: 'inspection_id is required' }, { status: 400 });
    }
    
    const records = await getMaintenanceRecords(inspectionId);
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    return NextResponse.json({ error: 'Failed to fetch maintenance records' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const record = await createMaintenanceRecord(body);
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Error creating maintenance record:', error);
    return NextResponse.json({ error: 'Failed to create maintenance record' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const record = await updateMaintenanceRecord(body.id, body);
    return NextResponse.json(record);
  } catch (error) {
    console.error('Error updating maintenance record:', error);
    return NextResponse.json({ error: 'Failed to update maintenance record' }, { status: 500 });
  }
}
