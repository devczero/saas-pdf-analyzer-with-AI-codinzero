// types/user.ts
export type UserResponse = {
    id: string;
    email: string;
    subscription: {
      status: string;
      currentPeriodEnd: Date;
      planId: string;
    } | null;
  }