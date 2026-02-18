import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      organizationId: string;
      role: 'admin' | 'editor' | 'viewer' | 'investor';
    };
  }

  interface User {
    organizationId?: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    organizationId?: string;
    role?: string;
  }
}
