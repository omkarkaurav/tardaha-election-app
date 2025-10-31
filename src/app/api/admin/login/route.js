import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { admins } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }
        const results = await db.select().from(admins).where(eq(admins.email, email));
        if (results.length === 0) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
        const adminUser = results[0];
        const isMatch = await bcrypt.compare(password, adminUser.passwordHash);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
        const token = jwt.sign({ id: adminUser.id, email: adminUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return NextResponse.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Server error during login' }, { status: 500 });
    }
}