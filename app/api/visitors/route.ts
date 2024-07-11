import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

const getVisitorIP = (req: NextApiRequest) => {
  const ip = req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress;

  return Array.isArray(ip) ? ip[0] : ip;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const visitorIpAddress = getVisitorIP(req);

    try {
      // Check if the visitor's IP address already exists in the Visitors table
      const { data: existingVisitor, error: selectError } = await supabase
        .from('visitors')
        .select('id')
        .eq('ip_address', visitorIpAddress)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error checking existing visitor:', selectError);
        return res.status(500).json({ error: selectError.message });
      }

      if (!existingVisitor) {
        // If the IP address doesn't exist, insert it into the Visitors table
        const { error: insertError } = await supabase
          .from('visitors')
          .insert([{ ip_address: visitorIpAddress, visit_time: new Date() }]);

        if (insertError) {
          console.error('Error inserting visitor:', insertError);
          return res.status(500).json({ error: insertError.message });
        }
      }

      // Get the total number of visitors in the Visitors table
      const { count, error: countError } = await supabase
        .from('visitors')
        .select('*', { count: 'exact' });

      if (countError) {
        console.error('Error getting visitor count:', countError);
        return res.status(500).json({ error: countError.message });
      }

      res.status(200).json({ count });
    } catch (error) {
      console.error('Error logging visit:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      // Get the total number of visitors in the Visitors table
      const { count, error: countError } = await supabase
        .from('visitors')
        .select('*', { count: 'exact' });

      if (countError) {
        console.error('Error fetching visitor count:', countError);
        return res.status(500).json({ error: countError.message });
      }

      res.status(200).json({ count });
    } catch (error) {
      console.error('Error fetching visitor count:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
