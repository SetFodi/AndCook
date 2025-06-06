import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../../../../lib/db/mongodb';
import User from '../../../../lib/models/User';

export const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || '/images/default-avatar.png',
          role: user.role || 'user',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
        console.log("JWT callback - Adding user ID and role to token:", user.id, user.role);
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Special case for admin user
        const isAdmin = session.user.email === 'lukafartenadze2004@gmail.com';

        // Ensure the user object has an id property and role
        session.user = {
          ...session.user,
          id: token.id as string,
          // Force admin role for specific email
          role: isAdmin ? 'admin' : (token.role as string || 'user'),
          image: session.user.image || '/images/default-avatar.png'
        };
        console.log("Session callback - Adding user ID and role to session:", token.id, isAdmin ? 'admin (forced)' : token.role);
        console.log("Updated session user:", session.user);
      } else {
        console.log("Session callback - Warning: Unable to add user ID to session", {
          hasToken: !!token,
          hasSessionUser: !!session.user,
          token: token
        });
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
