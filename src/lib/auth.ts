// Configuration NextAuth.js — Credentials Provider avec MongoDB/Prisma
// Authentification par email + mot de passe uniquement

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  // Stratégie JWT obligatoire avec le provider Credentials
  session: {
    strategy: 'jwt',
  },
  
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'البريد الإلكتروني', type: 'email' },
        password: { label: 'كلمة المرور', type: 'password' },
      },
      
      async authorize(credentials) {
        // Vérifier que les champs sont remplis
        if (!credentials?.email || !credentials?.password) {
          throw new Error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
        }

        // Chercher l'utilisateur dans la base de données
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error('لا يوجد حساب بهذا البريد الإلكتروني');
        }

        // Comparer le mot de passe hashé
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('كلمة المرور غير صحيحة');
        }

        // Retourner les données utilisateur (sans le mot de passe)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  // Callbacks pour enrichir le token JWT et la session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },

  // Page de connexion personnalisée
  pages: {
    signIn: '/login',
  },
};
