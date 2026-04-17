import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'System',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'roles'],
    hidden: ({ user }) => {
      return user?.role !== 'admin';
    },
  },
  auth: {
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600000,
    tokenExpiration: 7200,
    forgotPassword: {
      generateEmailHTML: (args) => {
        const token = args?.token || '';
        const userEmail = args?.user?.email || '';
        return `
          <h1>Reset Your Password</h1>
          <p>Hi ${userEmail},</p>
          <p>Click the link below to reset your password:</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/reset-password?token=${token}">
            Reset Password
          </a>
        `;
      },
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'admin';
    },
    create: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'admin';
    },
    update: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'admin';
    },
    delete: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'admin';
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
      ],
      access: {
        update: ({ req: { user } }) => {
          return user?.role === 'admin';
        },
      },
    },
  ],
};
