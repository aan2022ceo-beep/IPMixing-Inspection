import { NextRequest, NextResponse } from 'next/server';
import { getInspections, createInspection } from '@/lib/db';

export async function GET() {
  try {
    const inspections = await getInspections();
    return NextResponse.json(inspections);
  } catch (error) {
    console.error('Error fetching inspections:', error);
    return NextResponse.json({ error: 'Failed to fetch inspections' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inspection = await createInspection(body);
    return NextResponse.json(inspection, { status: 201 });
  } catch (error) {
    console.error('Error creating inspection:', error);
    return NextResponse.json({ error: 'Failed to create inspection' }, { status: 500 });
  }
}
