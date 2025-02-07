import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          
          const user = {
            id: "1", 
            email: "admin@example.com",
            role: "admin",
            password: "admin123",
          };
  
          // Validate user credentials
          if (
            credentials &&
            credentials.email === user.email &&
            credentials.password === user.password
          ) {
            return {
              id: user.id,
              email: user.email,
              role: user.role,
            };
          }
  
          return null;
        },
      }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: any }) {
        if (user) {
            token.id = user.id;
            token.role = user.role; // Attach role to token
            token.email = user.email;
        }
        return token;
        },
        async session({ session, token }: { session: any; token: JWT }) {
        session.user = {
            ...session.user,
            id: token.id,
            role: token.role, // Add role to session
            email: token.email,
        };
        return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET, // Set this in your environment variables
};

export default NextAuth(authOptions);
