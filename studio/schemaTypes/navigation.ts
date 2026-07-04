import { defineField, defineType } from 'sanity';

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'navItems',
      title: 'Nav items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navItem',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'href', title: 'Href', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'isExternal', title: 'Opens externally', type: 'boolean', initialValue: false }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'href', title: 'Href', type: 'url', validation: (rule) => rule.required() }),
            defineField({ name: 'icon', title: 'Icon key', type: 'string', description: 'e.g. github, linkedin, dribbble, medium, adplist' }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Navigation content' }),
  },
});
