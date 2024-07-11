// pages/api/logVisit.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    const { data, error } = await supabase.from('visitors').insert([{ ip_address: ip }]);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
