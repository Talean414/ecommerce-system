import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string; // ✅ Add role
      verified: boolean; // ✅ Add verified
    };
  }
  interface User {
    id: string;
    role: string; // ✅ Add role
    verified: boolean; // ✅ Add verified
  }
}
