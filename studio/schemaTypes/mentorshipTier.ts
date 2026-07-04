import { defineField, defineType } from 'sanity';

export const mentorshipTier = defineType({
  name: 'mentorshipTier',
  title: 'Mentorship tier',
  type: 'document',
  fields: [
    defineField({
      name: 'tierId',
      title: 'ID',
      type: 'slug',
      description: 'Stable identifier, e.g. "paid-starter".',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: [{ title: 'Free', value: 'free' }, { title: 'Paid', value: 'paid' }] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'Leave empty for free tiers.',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
    }),
    defineField({
      name: 'includes',
      title: 'Includes',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'forWhom',
      title: 'For whom',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'cta',
      title: 'Call to action',
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
        defineField({ name: 'href', title: 'Href', type: 'string', validation: (rule) => rule.required() }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: 'Sort order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'type' },
  },
});
