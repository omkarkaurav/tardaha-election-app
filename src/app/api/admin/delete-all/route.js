import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supporters } from '@/db/schema';
import { checkAdminAuth } from '@/lib/auth';

export async function DELETE(request) {
    const auth = checkAdminAuth(request);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    try {
        await db.delete(supporters);
        return NextResponse.json({ message: 'All supporter data has been deleted.' });
    } catch (error) {
        console.error('Error deleting all data:', error);
        return NextResponse.json({ error: 'Failed to delete data.' }, { status: 500 });
    }
}