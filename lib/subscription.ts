// lib/subscription.ts
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export const checkSubscription = async () => {
  const { userId } = await auth();
  
  if (!userId) {
    return false;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true }
  });

  return !!user?.subscription;
};