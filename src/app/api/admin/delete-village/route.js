// src/app/api/admin/delete-village/route.js

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supporters } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { checkAdminAuth } from '@/lib/auth';

export async function DELETE(request) {
    // Protect the route
    const auth = checkAdminAuth(request);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        const { village } = await request.json();

        if (!village) {
            return NextResponse.json({ error: 'Village name is required' }, { status: 400 });
        }

        // Delete all supporters with the matching village
        const deleted = await db.delete(supporters).where(eq(supporters.village, village)).returning();

        return NextResponse.json({ message: `Deleted ${deleted.length} supporters from ${village}.` });
    } catch (error) {
        console.error('Error deleting supporters by village:', error);
        return NextResponse.json({ error: 'Failed to delete supporters.' }, { status: 500 });
    }
}