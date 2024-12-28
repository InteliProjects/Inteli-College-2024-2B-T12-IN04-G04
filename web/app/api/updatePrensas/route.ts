import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  console.log('Request received');
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { maximum_distance, operating_time, prensaId } = body;

  const prensaIdNumber = Number(prensaId);

  if (isNaN(prensaIdNumber)) {
    return NextResponse.json({ error: 'PrensaId must be a number' }, { status: 400 });
  }

  console.log('Parsed body:', body);

  if (!prensaIdNumber) {
    return NextResponse.json({ error: 'PrensaId is required' }, { status: 400 });
  }

  const data: {
    MaximumDistance?: number;
    OperatingTime?: number;
  } = {};
  if (maximum_distance !== undefined) {
    data.MaximumDistance = Number(maximum_distance);
  }
  if (operating_time !== undefined) {
    data.OperatingTime = Number(operating_time);
  }

  try {
    const updatedPrensa = await prisma.prensas.update({
      where: { Id: prensaIdNumber },
      data,
    });
    if (!updatedPrensa) {
      console.error('No Prensa found to update');
      return NextResponse.json({ error: 'Prensa not found' }, { status: 404 });
    }
    console.log('Prensa updated successfully:', updatedPrensa);
    return NextResponse.json(updatedPrensa, { status: 200 });
  } catch (error) {
    console.error('Error updating Prensa:', error);
    return NextResponse.json({ error: 'Failed to update Prensa' }, { status: 500 });
  }
}