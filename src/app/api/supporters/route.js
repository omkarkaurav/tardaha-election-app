import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supporters } from '@/db/schema';
import { desc, sql } from 'drizzle-orm';


export async function POST(request) {
    try {
        const { name, village, contact, comment } = await request.json();

        // 1. Get the client's IP Address (Vercel/Next.js/Proxy standard headers)
        const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.ip;

        // 2. Server-side validation (IP is mandatory for uniqueness)
        if (!name || !village || !ipAddress) {
            return NextResponse.json({ error: 'Name, Village, and IP Address are required fields' }, { status: 400 });
        }

        // 3. Insert supporter data including the IP address
        const newSupporter = await db.insert(supporters).values({ 
            name, 
            village, 
            contact, 
            comment,
            ipAddress // Insert the client's IP address to enforce uniqueness
        }).returning();

        return NextResponse.json(newSupporter[0], { status: 201 });
    } catch (error) {
        console.error('Error adding supporter:', error);
        
        // Use the nested error cause for reliable PostgreSQL error checking with Drizzle
        const pgError = error.cause;
        
        // 4. Handle unique constraint violation (PostgreSQL error code '23505') for the IP address
        // We check against the explicit constraint name for accuracy.
        if (pgError && pgError.code === '23505' && pgError.constraint === 'supporters_ip_address_unique') {
             return NextResponse.json({ error: 'You have already registered your support. You can only support once.' }, { status: 409 });
        }
        
        return NextResponse.json({ error: 'Failed to add supporter' }, { status: 500 });
    }
}


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    // Use an optional 'page' parameter for the client-side list
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 10; // Fixed items per page
    const offset = (page - 1) * limit;

    // 1. Fetch total count for pagination metadata
    const totalCountResult = await db.select({ count: sql`count(*)` }).from(supporters);
    const totalItems = totalCountResult[0]?.count || 0;

    // 2. Fetch supporters with limit and offset for pagination
    const paginatedSupporters = await db
      .select()
      .from(supporters)
      .orderBy(desc(supporters.createdAt))
      .limit(limit)
      .offset(offset);

    // Return both the data and the pagination metadata
    return NextResponse.json({
        supporters: paginatedSupporters,
        totalItems: parseInt(totalItems, 10),
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        limit: limit,
    });
  } catch (error) {
    console.error('Error fetching paginated supporters:', error);
    return NextResponse.json({ error: 'Failed to fetch supporters list' }, { status: 500 });
  }
}