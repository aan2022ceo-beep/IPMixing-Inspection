import { NextRequest, NextResponse } from 'next/server';
import { getAbnormalData, createAbnormalData } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const inspectionId = searchParams.get('inspection_id');
    
    if (!inspectionId) {
      return NextResponse.json({ error: 'inspection_id is required' }, { status: 400 });
    }
    
    const data = await getAbnormalData(inspectionId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching abnormal data:', error);
    return NextResponse.json({ error: 'Failed to fetch abnormal data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await createAbnormalData(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating abnormal data:', error);
    return NextResponse.json({ error: 'Failed to create abnormal data' }, { status: 500 });
  }
}
