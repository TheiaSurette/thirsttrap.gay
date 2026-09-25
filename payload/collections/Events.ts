import type {
  CollectionConfig,
  CollectionBeforeValidateHook,
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload';
import { revalidateTag } from 'next/cache';

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

const revalidateEvent: CollectionAfterChangeHook = ({ doc }) => {
  revalidateTag('homepage', 'max');
  revalidateTag('events', 'max');
  if (doc.slug) {
    revalidateTag(`event-${doc.slug}`, 'max');
  }
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
    afterDelete: [
      (({ doc }) => {
        revalidateTag('homepage', 'max');
        revalidateTag('events', 'max');
        return doc;
      }) satisfies CollectionAfterDeleteHook,
    ],
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
        description: 'Feature this event on the homepage while it is upcoming',
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
      timezone: {
        defaultTimezone: 'America/New_York',
        supportedTimezones: [
          { label: 'New York (event local time)', value: 'America/New_York' },
        ],
      },
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      timezone: {
        required: true,
        defaultTimezone: 'America/New_York',
        supportedTimezones: [
          { label: 'New York (event local time)', value: 'America/New_York' },
        ],
      },
      admin: {
        description:
          'Optional end time. Otherwise the event ends at 6 AM after its scheduled night (America/New_York).',
        date: { pickerAppearance: 'dayAndTime' },
      },
      validate: (value, { siblingData }) => {
        if (!value) return true;
        const { date } = siblingData as { date?: string };
        return (
          (!!date && new Date(value).getTime() > Date.parse(date)) ||
          'End time must be after the start time.'
        );
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
        description:
          'Links shown on the event detail page (tickets, RSVP, etc.)',
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
