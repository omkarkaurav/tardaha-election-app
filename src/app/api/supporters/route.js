import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supporters } from '@/db/schema';

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
            ipAddress // NEW: Insert the client's IP address to enforce uniqueness
        }).returning();

        return NextResponse.json(newSupporter[0], { status: 201 });
    } catch (error) {
        console.error('Error adding supporter:', error);
        
        // 4. Handle unique constraint violation (PostgreSQL error code '23505') for the IP address
        // Note: 'supporters_ip_address_unique' is the expected constraint name based on the schema update.
        if (error.code === '23505' && error.message.includes('supporters_ip_address_unique')) {
             return NextResponse.json({ error: 'You have already registered your support. You can only support once.' }, { status: 409 });
        }
        
        return NextResponse.json({ error: 'Failed to add supporter' }, { status: 500 });
    }
}