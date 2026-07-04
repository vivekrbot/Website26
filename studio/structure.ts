import type { StructureResolver } from 'sanity/structure';

// "about" and "navigation" are singletons — one document each, edited directly
// rather than through a list view.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('About')
        .id('about')
        .child(S.document().schemaType('about').documentId('about')),
      S.listItem()
        .title('Navigation')
        .id('navigation')
        .child(S.document().schemaType('navigation').documentId('navigation')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !['about', 'navigation'].includes(item.getId() ?? '')
      ),
    ]);
