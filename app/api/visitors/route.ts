import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || req.ip;

    if (!ip) {
      return new NextResponse('IP address not found', { status: 400 });
    }

    // Check if the IP address already exists in the visitors table
    const { data: existingVisitor, error: checkError } = await supabase
      .from('visitors')
      .select('id')
      .eq('ip_address', ip);

    if (checkError) {
      throw new Error('Error checking visitor IP: ' + checkError.message);
    }

    if (existingVisitor && existingVisitor.length > 0) {
      return new NextResponse('Visitor already counted', { status: 200 });
    }

    // Insert new visitor IP address
    const { error: insertError } = await supabase
      .from('visitors')
      .insert([{ ip_address: ip }]);

    if (insertError) {
      throw new Error('Error inserting visitor IP: ' + insertError.message);
    }

    return new NextResponse('Visitor IP saved', { status: 201 });
  } catch (error) {
    return new NextResponse('Error processing request: ' + error.message, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    // Get the total number of visitors
    const { data: visitorCount, error: countError } = await supabase
      .from('visitors')
      .select('id', { count: 'exact' });

    if (countError) {
      throw new Error('Error retrieving visitor count: ' + countError.message);
    }

    return NextResponse.json({ count: visitorCount.length }, { status: 200 });
  } catch (error) {
    return new NextResponse('Error processing request: ' + error.message, { status: 500 });
  }
}
