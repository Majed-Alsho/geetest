import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import * as bcrypt from "bcryptjs";

// Hash password for new users
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Return null if credentials are missing
        if (!credentials?.email || !credentials?.password) {
          console.log('[NextAuth] Missing credentials');
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        console.log('[NextAuth] Attempting login for:', email);

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user) {
          console.log('[NextAuth] User not found:', email);
          return null;
        }

        if (!user.passwordHash) {
          console.log('[NextAuth] User has no password hash:', email);
          return null;
        }

        if (user.isSuspended) {
          console.log('[NextAuth] User is suspended:', email);
          // Return null with error - client will see "Invalid credentials"
          return null;
        }

        const isValid = await verifyPassword(password, user.passwordHash);
        
        console.log('[NextAuth] Password validation result:', isValid);

        if (!isValid) {
          console.log('[NextAuth] Invalid password for:', email);
          return null;
        }

        console.log('[NextAuth] Login successful for:', email, 'Role:', user.role);

        // Update login stats
        await db.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            loginCount: { increment: 1 },
          },
        }).catch(err => console.error('[NextAuth] Failed to update login stats:', err));

        // Create audit log
        await db.auditLog.create({
          data: {
            actorId: user.id,
            action: "user.login",
            targetType: "user",
            targetId: user.id,
            severity: "INFO",
          },
        }).catch(err => console.error('[NextAuth] Failed to create audit log:', err));

        return {
          id: user.id,
          email: user.email,
          name: user.name || '',
          role: user.role,
          clientNumber: user.clientNumber,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in - keep token MINIMAL to stay under 4KB cookie limit
      if (user) {
        // Only store essential data in JWT - id and role are critical
        // Strip out clientNumber and other non-essential fields to prevent cookie overflow
        token.id = user.id;
        token.role = user.role;
        // IMPORTANT: Do NOT store clientNumber, name, email in token - fetch from DB in session callback
      }

      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
      }

      return token;
    },
    async session({ session, token }) {
      // Reconstruct session from minimal JWT token
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        // Fetch additional user data from DB instead of storing in token
        // This keeps the JWT small and prevents 4KB cookie limit issues
        try {
          const dbUser = await db.user.findUnique({
            where: { id: token.id as string },
            select: { clientNumber: true, name: true }
          });
          if (dbUser) {
            session.user.clientNumber = dbUser.clientNumber;
            session.user.name = dbUser.name;
          }
        } catch {
          // Gracefully handle DB errors - session still works with minimal data
        }
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.id) {
        await db.auditLog.create({
          data: {
            actorId: token.id as string,
            action: "user.logout",
            targetType: "user",
            targetId: token.id as string,
            severity: "INFO",
          },
        }).catch(() => {});
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode
};

// Type augmentation for next-auth
declare module "next-auth" {
  interface User {
    role?: string;
    clientNumber?: string | null;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role?: string;
      clientNumber?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    clientNumber?: string | null;
  }
}
