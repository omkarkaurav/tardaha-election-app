// src/app/api/admin/supporters/route.js

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supporters } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { checkAdminAuth } from '@/lib/auth';

export async function GET(request) {
    // Protect the route
    const auth = checkAdminAuth(request);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        // Fetch all supporters, ordered by village and then by creation date
        const allSupporters = await db
            .select()
            .from(supporters)
            .orderBy(desc(supporters.village), desc(supporters.createdAt));
        
        return NextResponse.json(allSupporters);
    } catch (error) {
        console.error('Error fetching all supporters:', error);
        return NextResponse.json({ error: 'Failed to fetch supporter data.' }, { status: 500 });
    }
}