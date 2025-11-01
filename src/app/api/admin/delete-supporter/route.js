// src/app/api/admin/delete-supporter/route.js

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
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Supporter ID is required' }, { status: 400 });
        }

        // Delete the supporter with the matching ID
        const deleted = await db.delete(supporters).where(eq(supporters.id, id)).returning();

        if (deleted.length === 0) {
            return NextResponse.json({ error: 'Supporter not found' }, { status: 404 });
        }

        return NextResponse.json({ message: `Supporter ${id} deleted successfully.` });
    } catch (error) {
        console.error('Error deleting supporter:', error);
        return NextResponse.json({ error: 'Failed to delete supporter.' }, { status: 500 });
    }
}