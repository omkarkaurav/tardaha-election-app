import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supporters } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const recentSupporters = await db
      .select()
      .from(supporters)
      .orderBy(desc(supporters.createdAt))
      .limit(10);
    return NextResponse.json(recentSupporters);
  } catch (error) {
    console.error('Error fetching recent supporters:', error);
    return NextResponse.json({ error: 'Failed to fetch recent supporters' }, { status: 500 });
  }
}