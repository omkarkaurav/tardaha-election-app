import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supporters } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const villageCounts = await db
      .select({ village: supporters.village, count: sql`count(*)` })
      .from(supporters)
      .groupBy(supporters.village);

    const totalCountResult = await db.select({ count: sql`count(*)` }).from(supporters);
    const totalCount = totalCountResult[0]?.count || 0;

    const stats = villageCounts.reduce((acc, row) => {
      acc[row.village] = parseInt(row.count, 10);
      return acc;
    }, {});
    stats.total = parseInt(totalCount, 10);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}