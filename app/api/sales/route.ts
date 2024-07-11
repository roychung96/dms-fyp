import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabase.from('sales').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { customer_id, product_id, salesperson_id, amount } = body;
  const { data, error } = await supabase.from('sales').insert([{ customer_id, product_id, salesperson_id, amount }]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, customer_id, product_id, salesperson_id, amount } = body;
  const { data, error } = await supabase.from('sales').update({ customer_id, product_id, salesperson_id, amount }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const { error } = await supabase.from('sales').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Sale deleted successfully' }, { status: 200 });
}
