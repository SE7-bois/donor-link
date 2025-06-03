import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SigninMessage } from "~/utils/SigninMessage";

const handler = NextAuth({
  // Force the correct base URL for local development
  ...(process.env.NODE_ENV === "development" && {
    url: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  }),
  providers: [
    CredentialsProvider({
      name: "Solana",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.message || !credentials?.signature) {
            return null;
          }

          const signinMessage = new SigninMessage(
            JSON.parse(credentials.message)
          );

          // More flexible domain validation for development and production
          const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
          const vercelUrl = process.env.VERCEL_URL;
          const allowedDomains = [
            new URL(nextAuthUrl).host,
            "localhost:3000",
            "127.0.0.1:3000",
            "www.kecil.dev",
            "kecil.dev",
            ...(vercelUrl ? [vercelUrl] : []),
          ];

          if (!allowedDomains.includes(signinMessage.domain)) {
            throw new Error(`Domain validation failed`);
          }

          const csrfToken = await getCsrfToken({ req: { ...req, body: null } });

          if (signinMessage.nonce !== csrfToken) {
            throw new Error(`CSRF token validation failed`);
          }

          const validationResult = await signinMessage.validate(credentials.signature);

          if (!validationResult) {
            throw new Error(`Signature validation failed`);
          }

          return {
            id: signinMessage.publicKey,
            name: signinMessage.publicKey,
            email: `${signinMessage.publicKey}@solana.wallet`,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      // @ts-ignore
      session.publicKey = token.sub;
      if (session.user) {
        session.user.name = token.sub;
        session.user.image = `https://ui-avatars.com/api/?name=${token.sub}&background=random`;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    error: '/auth/error', // Optional: custom error page
  },
});

export { handler as GET, handler as POST }; 