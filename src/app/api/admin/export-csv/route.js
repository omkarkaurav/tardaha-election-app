// src/app/api/admin/export-csv/route.js

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supporters } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { checkAdminAuth } from '@/lib/auth';

// Helper function to escape CSV fields
const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    // If the string contains a comma, quote, or newline, wrap it in double quotes
    // and double up any existing double quotes.
    if (/[",\n\r]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`; // Always quote for safety
};

export async function GET(request) {
    const auth = checkAdminAuth(request);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const village = searchParams.get('village');

    try {
        let query = db.select().from(supporters);

        // If a village is specified, filter the query
        if (village) {
            query = query.where(eq(supporters.village, village));
        }

        const allSupporters = await query.orderBy(desc(supporters.createdAt));

        // Define CSV headers
        const headers = [
            "id", "name", "village", "contact", "comment", "ipAddress", "createdAt"
        ];
        
        // Convert JSON data to CSV rows
        const csvRows = allSupporters.map(row =>
            headers.map(header => escapeCSV(row[header])).join(',')
        );

        // Combine headers and rows
        const csv = [headers.join(','), ...csvRows].join('\n');

        const fileName = village 
            ? `supporters-export-${village}-${Date.now()}.csv` 
            : `supporters-export-all-${Date.now()}.csv`;

        // Return the CSV as a downloadable file
        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${fileName}"`
            }
        });
    } catch (error) {
        console.error('Error exporting CSV data:', error);
        return NextResponse.json({ error: 'Failed to export data.' }, { status: 500 });
    }
}