import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabase.from('stock').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { brand, model, year, engine, price, status, photo } = body;
  const { data, error } = await supabase.from('stock').insert([{ brand, model, year, engine, price, status, photo }]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, brand, model, year, engine, price, status, photo } = body;
  const { data, error } = await supabase.from('stock').update({ brand, model, year, engine, price, status, photo }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const { error } = await supabase.from('stock').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Stock deleted successfully' }, { status: 200 });
}
