// pages/api/visitors.ts
import { NextResponse } from 'next/server';

// Create the Visitors table if it doesn't exist
async function createVisitorsTable() {
  await sql`CREATE TABLE IF NOT EXISTS Visitors (
    id serial PRIMARY KEY,
    ip_address varchar(255) UNIQUE
  );`;
}

// Function to count visitors and return the count
async function countVisitors(request: Request): Promise<number> {
  // Get the visitor's IP address from the request headers
  const visitorIpAddress = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip');

  try {
    // Check if the visitor's IP address already exists in the Visitors table
    const existingVisitor = await sql`SELECT * FROM Visitors WHERE ip_address = ${visitorIpAddress}`;

    if (existingVisitor.rowCount > 0) {
      // If the IP address exists, the visitor has already been counted
      return (await sql`SELECT COUNT(*) FROM Visitors`).rows[0].count;
    } else {
      // If the IP address doesn't exist, insert it into the Visitors table
      await sql`INSERT INTO Visitors (ip_address) VALUES (${visitorIpAddress})`;
      
      // Get the total number of visitors in the Visitors table
      return (await sql`SELECT COUNT(*) FROM Visitors`).rows[0].count;
    }
  } catch (error) {
    throw error;
  }
}

// POST route to count visitors and send only the visitor count
export async function POST(request: Request) {
  try {
    await createVisitorsTable();
    const visitorCount = await countVisitors(request);
    return NextResponse.json({ count: visitorCount }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// GET route to retrieve visitor count
export async function GET(request: Request) {
  try {
    await createVisitorsTable();
    const visitorCount = await countVisitors(request);
    return NextResponse.json({ message: 'Visitor count retrieved successfully.', count: visitorCount }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
