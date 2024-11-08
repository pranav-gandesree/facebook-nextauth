import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";

const clientId = process.env.FACEBOOK_CLIENT_ID!;
const clientSecret = process.env.FACEBOOK_CLIENT_SECRET!;

export const authOptions = {
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    FacebookProvider({
      clientId: clientId,
      clientSecret: clientSecret,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
