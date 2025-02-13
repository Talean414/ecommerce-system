// src/types/next-auth.d.ts

import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string; // ✅ Add role
      verified: boolean; // ✅ Add verified
    } & DefaultSession["user"]; // Ensures it keeps existing user fields
  }

  interface User extends DefaultUser {
    id: string;
    role: string; // ✅ Add role
    verified: boolean; // ✅ Add verified
  }
}

