import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supporters } from '@/db/schema';
import { desc, sql, eq } from 'drizzle-orm'; // Import 'eq' for filtering

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const village = searchParams.get('village'); // NEW: Get village filter
    const limit = 5; // Use a reasonable limit for column size
    const offset = (page - 1) * limit;

    let whereClause = undefined;
    if (village) {
        // Apply filter if village parameter is present
        whereClause = eq(supporters.village, village);
    } else {
        // If no village is specified, return an error as the client expects it.
        return NextResponse.json({ error: 'Village parameter is required for paginated village view.' }, { status: 400 });
    }

    // 1. Fetch total count for the specific village
    const totalCountResult = await db.select({ count: sql`count(*)` })
        .from(supporters)
        .where(whereClause);
    const totalItems = totalCountResult[0]?.count || 0;

    // 2. Fetch supporters for the specific village with limit and offset
    const paginatedSupporters = await db
      .select()
      .from(supporters)
      .where(whereClause)
      .orderBy(desc(supporters.createdAt))
      .limit(limit)
      .offset(offset);

    // Return the data and pagination metadata
    return NextResponse.json({
        supporters: paginatedSupporters,
        totalItems: parseInt(totalItems, 10),
        currentPage: page,
        totalPages: Math.ceil(parseInt(totalItems, 10) / limit),
        limit: limit,
    });
  } catch (error) {
    console.error('Error fetching paginated supporters:', error);
    return NextResponse.json({ error: 'Failed to fetch supporters list' }, { status: 500 });
  }
}