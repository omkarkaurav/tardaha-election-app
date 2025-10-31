import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supporters } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { checkAdminAuth } from '@/lib/auth';

export async function GET(request) {
    const auth = checkAdminAuth(request);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    try {
        const allSupporters = await db.select().from(supporters).orderBy(desc(supporters.createdAt));
        const dataToExport = {
            exportDate: new Date().toISOString(),
            supporterCount: allSupporters.length,
            supporters: allSupporters,
        };
        return NextResponse.json(dataToExport, {
            headers: { 'Content-Disposition': `attachment; filename="supporters-export-${Date.now()}.json"` }
        });
    } catch (error) {
        console.error('Error exporting data:', error);
        return NextResponse.json({ error: 'Failed to export data.' }, { status: 500 });
    }
}