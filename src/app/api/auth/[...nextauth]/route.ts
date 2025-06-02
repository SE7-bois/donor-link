import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SigninMessage } from "~/utils/SigninMessage";

const handler = NextAuth({
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
          console.log("🔐 NextAuth authorize called");
          console.log("📋 Credentials received:", !!credentials?.message, !!credentials?.signature);

          if (!credentials?.message || !credentials?.signature) {
            console.error("❌ Missing credentials");
            return null;
          }

          const signinMessage = new SigninMessage(
            JSON.parse(credentials.message)
          );

          console.log("📄 Parsed signin message:", {
            domain: signinMessage.domain,
            publicKey: signinMessage.publicKey,
            nonce: signinMessage.nonce?.substring(0, 8) + "...",
            statement: signinMessage.statement,
          });

          // More flexible domain validation for development and production
          const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
          const allowedDomains = [
            new URL(nextAuthUrl).host,
            "localhost:3000", // for development
            "127.0.0.1:3000", // for development
          ];

          console.log("🌐 Domain validation:", {
            messageDomain: signinMessage.domain,
            allowedDomains,
            nextAuthUrl,
            isValid: allowedDomains.includes(signinMessage.domain)
          });

          if (!allowedDomains.includes(signinMessage.domain)) {
            console.error("❌ Domain validation failed", {
              received: signinMessage.domain,
              expected: allowedDomains
            });
            return null;
          }

          console.log("🎫 Getting CSRF token...");
          const csrfToken = await getCsrfToken({ req: { ...req, body: null } });
          console.log("🎫 CSRF token validation:", {
            received: signinMessage.nonce?.substring(0, 8) + "...",
            expected: csrfToken?.substring(0, 8) + "...",
            matches: signinMessage.nonce === csrfToken,
            receivedLength: signinMessage.nonce?.length,
            expectedLength: csrfToken?.length
          });

          if (signinMessage.nonce !== csrfToken) {
            console.error("❌ CSRF token validation failed", {
              received: signinMessage.nonce,
              expected: csrfToken
            });
            return null;
          }

          console.log("✍️ Validating signature...");
          console.log("📝 Message to validate:", signinMessage.prepare());

          const validationResult = await signinMessage.validate(credentials.signature);
          console.log("📝 Signature validation result:", validationResult);

          if (!validationResult) {
            console.error("❌ Signature validation failed", {
              signature: credentials.signature?.substring(0, 16) + "...",
              message: signinMessage.prepare(),
              publicKey: signinMessage.publicKey
            });
            return null;
          }

          console.log("✅ Authentication successful for:", signinMessage.publicKey);
          return {
            id: signinMessage.publicKey,
            name: signinMessage.publicKey,
            email: `${signinMessage.publicKey}@solana.wallet`,
          };
        } catch (e) {
          console.error("💥 Authentication error:", e);
          if (e instanceof Error) {
            console.error("📋 Error details:", {
              message: e.message,
              stack: e.stack,
              name: e.name
            });
          }
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
      console.log("📋 Session callback:", {
        hasSession: !!session,
        hasToken: !!token,
        tokenSub: token.sub?.substring(0, 8) + "...",
      });

      // @ts-ignore
      session.publicKey = token.sub;
      if (session.user) {
        session.user.name = token.sub;
        session.user.image = `https://ui-avatars.com/api/?name=${token.sub}&background=random`;
      }
      return session;
    },
    async jwt({ token, user }) {
      console.log("🎫 JWT callback:", {
        hasToken: !!token,
        hasUser: !!user,
        userId: user?.id?.substring(0, 8) + "..." || "none",
      });

      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error("🚨 NextAuth Error:", { code, metadata });
    },
    warn(code) {
      console.warn("⚠️ NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.log("🔍 NextAuth Debug:", { code, metadata });
    },
  },
});

export { handler as GET, handler as POST }; 