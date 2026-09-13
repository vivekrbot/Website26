import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://itsvivek.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

interface SeoProps {
  /** Full, final page title — e.g. "Work — Vivek Ramachandran". */
  title: string;
  description: string;
  /** Route path, e.g. "/" or "/works/some-slug" — used to build canonical + og:url. */
  path: string;
  type?: 'website' | 'article';
  image?: string;
  /** For pages that shouldn't be indexed or claim a canonical URL, e.g. 404. */
  noindex?: boolean;
}

export function Seo({ title, description, path, type = 'website', image = DEFAULT_IMAGE, noindex = false }: SeoProps) {
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <link rel="canonical" href={url} />
      )}
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
