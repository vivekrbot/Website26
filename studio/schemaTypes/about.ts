import { defineField, defineType } from 'sanity';

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'aboutIntro',
      title: 'Intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'aboutFull',
      title: 'Full bio',
      type: 'text',
      rows: 10,
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'skill',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'category', title: 'Category', type: 'string', validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: 'name', subtitle: 'category' } },
        },
      ],
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'value',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
          ],
        },
      ],
    }),
    defineField({
      name: 'quickFacts',
      title: 'Quick facts',
      type: 'object',
      fields: [
        defineField({ name: 'city', title: 'City', type: 'string' }),
        defineField({ name: 'years', title: 'Years of experience', type: 'string' }),
        defineField({ name: 'background', title: 'Background', type: 'string' }),
        defineField({ name: 'currentRole', title: 'Current role', type: 'string' }),
        defineField({ name: 'education', title: 'Education', type: 'string' }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'About content' }),
  },
});
