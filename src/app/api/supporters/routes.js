import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supporters } from '@/db/schema';

export async function POST(request) {
    try {
        const { name, village, contact, comment } = await request.json();
        if (!name || !village) {
            return NextResponse.json({ error: 'Name and village are required' }, { status: 400 });
        }
        const newSupporter = await db.insert(supporters).values({ name, village, contact, comment }).returning();
        return NextResponse.json(newSupporter[0], { status: 201 });
    } catch (error) {
        console.error('Error adding supporter:', error);
        return NextResponse.json({ error: 'Failed to add supporter' }, { status: 500 });
    }
}