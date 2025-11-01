// src/app/api/admin/change-password/route.js

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { admins } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { checkAdminAuth } from '@/lib/auth';

export async function POST(request) {
    // 1. Authenticate the user
    const auth = checkAdminAuth(request);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        const { oldPassword, newPassword } = await request.json();
        if (!oldPassword || !newPassword) {
            return NextResponse.json({ error: 'Old and new passwords are required' }, { status: 400 });
        }

        // 2. Get the admin ID from the token
        const adminId = auth.user.id; 

        // 3. Find the user in the database
        const results = await db.select().from(admins).where(eq(admins.id, adminId));
        if (results.length === 0) {
            return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
        }
        const adminUser = results[0];

        // 4. Check if the OLD password is correct
        const isMatch = await bcrypt.compare(oldPassword, adminUser.passwordHash);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid old password' }, { status: 401 });
        }

        // 5. Hash the NEW password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // 6. Update the password in the database
        await db.update(admins)
            .set({ passwordHash: newPasswordHash })
            .where(eq(admins.id, adminId));

        return NextResponse.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json({ error: 'Server error during password change' }, { status: 500 });
    }
}