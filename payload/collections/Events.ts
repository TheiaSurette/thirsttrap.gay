import type { CollectionConfig, CollectionBeforeValidateHook, CollectionAfterChangeHook } from 'payload';
import { revalidateCache } from '../../lib/revalidate';

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

const generateSlug: CollectionBeforeValidateHook = ({ data }) => {
  if (data?.title && !data.slug) {
    data.slug = slugify(data.title);
  }
  return data;
};

const revalidateEvent: CollectionAfterChangeHook = async ({ doc }) => {
  const tags = ['homepage', 'events'];
  if (doc.slug) {
    tags.push(`event-${doc.slug}`);
  }
  await revalidateCache(tags);
  return doc;
};

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'status', 'featured'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return { status: { equals: 'published' } };
    },
    create: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'admin' || user.role === 'editor';
    },
    update: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'admin' || user.role === 'editor';
    },
    delete: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'admin' || user.role === 'editor';
    },
  },
  hooks: {
    beforeValidate: [generateSlug],
    afterChange: [revalidateEvent],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-generated from title',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Mark as the "Up Next" event on the homepage',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'venueName',
          type: 'text',
        },
        {
          name: 'address',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'state',
          type: 'text',
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'eventLinks',
      type: 'array',
      admin: {
        description: 'Links shown on the event detail page (tickets, RSVP, etc.)',
      },
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Ticket', value: 'ticket' },
            { label: 'External Link', value: 'external-link' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Map Pin', value: 'map-pin' },
          ],
        },
      ],
    },
  ],
};
