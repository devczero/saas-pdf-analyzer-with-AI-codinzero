// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Type-safe response
    const safeUser = {
      id: user.id,
      email: user.email,
      subscription: user.subscription ? {
        status: user.subscription.status,
        currentPeriodEnd: user.subscription.currentPeriodEnd,
        planId: user.subscription.planId
      } : null
    };

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('[USER_API_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}