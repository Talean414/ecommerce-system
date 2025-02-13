import NextAuth, { AuthOptions, User as NextAuthUser  } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient, user_role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Define the User type without emailVerified
type User = {
  id: string;
  email: string;
  name: string;
  role: user_role;
  verified: boolean;
};

// Extend NextAuth's User type
type CustomUser  = NextAuthUser  & User;

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            verified: true,
            password: true, // Required for password comparison
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          verified: user.verified,
        } as CustomUser ;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) { // Removed account, profile, isNewUser 
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as CustomUser ).role;
        token.verified = (user as CustomUser ).verified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as user_role;
        session.user.verified = token.verified as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

// Export the handler for GET and POST methods
export { handler as GET, handler as POST };